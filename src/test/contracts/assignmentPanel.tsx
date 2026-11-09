import type { ReactElement } from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi, type Mock } from 'vitest';
import { EXPORTER_API } from '../../constants';
import { mockNetworkError, type EndpointMock, type EndpointRef } from '../api';
import { server } from '../server';
import { clickAction } from '../helpers/accessForms';
import { findPanel } from '../helpers/panel';
import { renderApp } from '../render';
import type { StoreSeed } from '../store';
import { confirmDialog, mockPermissionsRefresh } from './accessPage';

interface PanelSetup<TItem> {
  /** Items already assigned to the record. */
  assigned: TItem[];
  /** Items the panel can assign. */
  available: TItem[];
  /** What the server reports as assigned right now, when another session changed it. */
  freshIds?: string[];
}

interface PanelHarness {
  user: UserEvent;
  onClose: Mock;
  save: EndpointMock<Record<string, string[]>>;
  /** Makes the next save or removal fail with this message. */
  failSave: () => void;
}

interface AssignedRoutes {
  get: EndpointRef;
  patch: EndpointRef;
}

/** The record as the server keeps it: GET answers its current state, PATCH merges into it. */
const mockAssignedRecord = <TRecord extends object>(
  routes: AssignedRoutes,
  record: TRecord,
  freshIds?: { field: string; ids: string[] },
): Pick<PanelHarness, 'save' | 'failSave'> => {
  let current: object = freshIds ? { ...record, [freshIds.field]: freshIds.ids } : record;
  const save: EndpointMock<Record<string, string[]>> = { calls: [] };
  const url = (route: EndpointRef) => `${EXPORTER_API.BASE_URL}/${route.path}`;
  server.use(
    http.get(url(routes.get), () => HttpResponse.json({ data: current })),
    http.patch(url(routes.patch), async ({ request }) => {
      const body = (await request.json()) as Record<string, string[]>;
      save.calls.push({ body, url: new URL(request.url), headers: request.headers });
      current = { ...current, ...body };
      return HttpResponse.json({ data: current });
    }),
  );
  return {
    save,
    failSave: () => {
      mockNetworkError('exporter', routes.patch);
    },
  };
};

/** Renders a panel whose record saves the way the server does. */
export const renderAssignmentPanel = (
  routes: AssignedRoutes,
  record: object,
  assigned: { field: string; freshIds?: string[] },
  panel: (onClose: () => void) => ReactElement,
  seed?: StoreSeed,
) => {
  mockPermissionsRefresh();
  const fresh = assigned.freshIds && { field: assigned.field, ids: assigned.freshIds };
  const saving = mockAssignedRecord(routes, record, fresh);
  const onClose = vi.fn();
  return { ...renderApp(panel(onClose), { seed }), ...saving, onClose };
};

interface AssignmentPanelContract<TItem extends { id: string }> {
  feature: string;
  build: (overrides?: Partial<TItem>) => TItem;
  /** The name the panel's list shows for an item. */
  itemName: (item: TItem) => string;
  render: (setup: PanelSetup<TItem>) => PanelHarness;
  field: string;
  submit: string;
  assignedToggle: string;
  searchPlaceholder: string;
  removeLabel: string;
  removeDialog: string;
  removeConfirm: string;
  savedToast?: string;
  saveFailed: string;
  removedToast: (item: TItem) => string;
}

/** What every "manage roles / groups / members" panel shares: pick, save, review and remove. */
export const describeAssignmentPanel = <TItem extends { id: string }>(
  contract: AssignmentPanelContract<TItem>,
): void => {
  const named = (item: TItem) => new RegExp(contract.itemName(item), 'i');
  const open = async (setup: PanelSetup<TItem>) => {
    const harness = contract.render(setup);
    const panel = within(await findPanel());
    return { ...harness, panel };
  };
  const openAssignedView = (user: UserEvent) => clickAction(user, contract.assignedToggle);
  const saveButton = () => screen.findByRole('button', { name: contract.submit, hidden: true });

  describe(`${contract.feature} assignment panel`, () => {
    it('lists the options with the assigned ones checked', async () => {
      const [held, free] = [contract.build(), contract.build()];
      const { panel } = await open({ assigned: [held], available: [held, free] });

      expect(await panel.findByRole('checkbox', { name: named(held) })).toBeChecked();
      expect(panel.getByRole('checkbox', { name: named(free) })).not.toBeChecked();
    });

    it('keeps save off until the selection changes', async () => {
      const [held, free] = [contract.build(), contract.build()];
      const { panel, user } = await open({ assigned: [held], available: [held, free] });

      expect(await saveButton()).toBeDisabled();

      await user.click(await panel.findByRole('checkbox', { name: named(free) }));
      expect(await saveButton()).toBeEnabled();

      await user.click(panel.getByRole('checkbox', { name: named(free) }));
      expect(await saveButton()).toBeDisabled();
    });

    it('saves the change on top of what the server holds now', async () => {
      const [held, free, addedElsewhere] = [contract.build(), contract.build(), contract.build()];
      const { panel, user, save, onClose } = await open({
        assigned: [held],
        available: [held, free, addedElsewhere],
        freshIds: [held.id, addedElsewhere.id],
      });

      await user.click(await panel.findByRole('checkbox', { name: named(free) }));
      await user.click(await saveButton());

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(save.calls[0].body).toEqual({
        [contract.field]: [held.id, addedElsewhere.id, free.id],
      });
      if (contract.savedToast) {
        expect(await screen.findByText(contract.savedToast)).toBeInTheDocument();
      }
    });

    it('stays open and reports a failed save', async () => {
      const free = contract.build();
      const { panel, user, failSave, onClose } = await open({ assigned: [], available: [free] });
      failSave();

      await user.click(await panel.findByRole('checkbox', { name: named(free) }));
      await user.click(await saveButton());

      expect(await screen.findByText(contract.saveFailed)).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
    });

    it('narrows the list by search', async () => {
      const [kept, dropped] = [contract.build(), contract.build()];
      const { panel, user } = await open({ assigned: [], available: [kept, dropped] });
      await panel.findByRole('checkbox', { name: named(kept) });

      await user.type(
        panel.getByPlaceholderText(contract.searchPlaceholder),
        contract.itemName(kept),
      );

      await waitFor(() =>
        expect(panel.queryByRole('checkbox', { name: named(dropped) })).not.toBeInTheDocument(),
      );
    });

    it('removes an assigned item from the assigned view', async () => {
      const [held, other] = [contract.build(), contract.build()];
      const { panel, user, save } = await open({
        assigned: [held, other],
        available: [held, other],
      });
      await panel.findByRole('checkbox', { name: named(held) });

      await openAssignedView(user);
      const removeButtons = await panel.findAllByRole('button', { name: contract.removeLabel });
      await user.click(removeButtons[0]);
      await confirmDialog(user, contract.removeDialog, contract.removeConfirm);

      expect(await screen.findByText(contract.removedToast(held))).toBeInTheDocument();
      expect(save.calls[0].body).toEqual({ [contract.field]: [other.id] });
      await waitFor(() =>
        expect(panel.getAllByRole('button', { name: contract.removeLabel })).toHaveLength(1),
      );
    });

    it('keeps the item when the removal fails', async () => {
      const held = contract.build();
      const { panel, user, failSave } = await open({ assigned: [held], available: [held] });
      await panel.findByRole('checkbox', { name: named(held) });
      failSave();

      await openAssignedView(user);
      await user.click(await panel.findByRole('button', { name: contract.removeLabel }));
      await confirmDialog(user, contract.removeDialog, contract.removeConfirm);

      await waitFor(() =>
        expect(panel.getByRole('button', { name: contract.removeLabel })).toBeInTheDocument(),
      );
    });
  });
};
