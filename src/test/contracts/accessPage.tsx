import type { ReactElement } from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BUTTON_TEXTS, Endpoints, LIST_TOOLBAR } from '../../constants';
import {
  mockEmptyEndpoint,
  mockEndpoint,
  mockNetworkError,
  type EndpointRef,
  type ServiceName,
} from '../api';
import { clickAction, pickMenuItem, pressIn } from '../helpers/accessForms';
import { findPanel } from '../helpers/panel';
import { renderApp } from '../render';
import { permissionsSeed } from '../store';
import { describeListPage } from './listPage';

const REFUSED_REASON = 'Refused by a policy';

/** Access mutations refetch the caller's permissions: keep them what the test seeded. */
export const mockPermissionsRefresh = () =>
  mockEndpoint('auth', Endpoints.AUTH.PERMISSIONS.GET, {
    userID: 'user-under-test',
    roles: permissionsSeed().permissions?.roles ?? [],
  });

/** The rendered row of a record, found by the text it shows. */
export const findRow = async (text: string | RegExp): Promise<HTMLElement> => {
  const row = (await screen.findByText(text)).closest('tr');
  if (!row) throw new Error(`"${String(text)}" isn't in a table row`);
  return row;
};

/** The open confirmation, once its title shows. */
const findConfirmDialog = (title: string): Promise<HTMLElement> =>
  waitFor(() => {
    const dialog = Array.from(document.querySelectorAll<HTMLElement>('.ant-modal')).find((modal) =>
      within(modal).queryByText(title),
    );
    if (!dialog) throw new Error(`No dialog shows "${title}"`);
    return dialog;
  });

export const confirmDialog = async (user: UserEvent, title: string, confirm: string) => {
  await user.click(within(await findConfirmDialog(title)).getByText(confirm));
};

/** Filters by `option`, sees `hidden` leave the list, clears the filter and finds it again. */
export const filterThenClear = async (user: UserEvent, option: string, hidden: string) => {
  await clickAction(user, 'Filter');
  const panel = await findPanel();
  await user.click(await within(panel).findByText(option));
  await pressIn(user, panel, BUTTON_TEXTS.APPLY);

  await waitFor(() => expect(screen.queryByText(hidden)).not.toBeInTheDocument());
  await clickAction(user, LIST_TOOLBAR.CLEAR_ALL_LABEL);
  return screen.findByText(hidden);
};

const clickInRow = async (user: UserEvent, row: HTMLElement, action: string) => {
  await user.click(within(row).getByLabelText(action));
};

/** The delete copy the Members and Groups pages keep under the same keys. */
interface StandardDeleteLabels {
  ACTIONS: {
    DELETE: string;
    DELETE_MODAL_TITLE: string;
    DELETE_MODAL_OK: string;
    BULK_DELETE: string;
    BULK_DELETE_MODAL_TITLE: string;
    BULK_DELETE_SUCCESS: (count: number) => string;
    BULK_DELETE_FAILED: string;
  };
  MESSAGES: { DELETE_FAILED: string };
  TOOLBAR: { MORE: string; BULK: { SELECT: string } };
}

export const standardDeleteFlows = <TItem,>(
  L: StandardDeleteLabels,
  success: (item: TItem) => string,
) => ({
  rowDelete: {
    action: L.ACTIONS.DELETE,
    dialog: L.ACTIONS.DELETE_MODAL_TITLE,
    confirm: L.ACTIONS.DELETE_MODAL_OK,
    success,
    failure: L.MESSAGES.DELETE_FAILED,
  },
  bulkDelete: {
    more: L.TOOLBAR.MORE,
    select: L.TOOLBAR.BULK.SELECT,
    action: L.ACTIONS.BULK_DELETE,
    dialog: L.ACTIONS.BULK_DELETE_MODAL_TITLE,
    confirm: L.ACTIONS.DELETE_MODAL_OK,
    success: L.ACTIONS.BULK_DELETE_SUCCESS,
    failure: L.ACTIONS.BULK_DELETE_FAILED,
  },
});

/** The page and the labels its delete flows use. */
interface AccessPageContract<TItem extends { id: string }> {
  feature: string;
  page: ReactElement;
  build: (overrides?: Partial<TItem>) => TItem;
  label: (item: TItem) => string;
  mockPage: (items: TItem[]) => void;
  /** The endpoint that lists the records. */
  listRoute: EndpointRef;
  emptyTitle: string;
  /** The endpoint that removes a record. */
  deleteRoute: { service: ServiceName; endpoint: (id: string) => EndpointRef };
  rowDelete: {
    action: string;
    dialog: string;
    confirm: string;
    success: (item: TItem) => string;
    failure: string;
  };
  bulkDelete: {
    more: string;
    select: string;
    action: string;
    dialog: string;
    confirm: string;
    success: (count: number) => string;
    failure: string;
  };
}

/** The list states and the delete flows, one at a time and in bulk, of every access page. */
export const describeAccessPage = <TItem extends { id: string }>(
  contract: AccessPageContract<TItem>,
): void => {
  describeListPage<TItem>({
    ...contract,
    mockList: contract.mockPage,
    failList: () => mockNetworkError('exporter', contract.listRoute),
  });

  const { rowDelete, bulkDelete, deleteRoute } = contract;
  const routeOf = (item: TItem) => deleteRoute.endpoint(item.id);
  const renderPage = (items: TItem[]) => {
    mockPermissionsRefresh();
    contract.mockPage(items);
    return renderApp(contract.page);
  };

  describe(`${contract.feature} delete`, () => {
    /** Two records on the page, with the delete of the first waiting for its confirmation. */
    const startDelete = async () => {
      const [item, other] = [contract.build(), contract.build()];
      const { user } = renderPage([item, other]);
      await clickInRow(user, await findRow(contract.label(item)), rowDelete.action);
      return { item, other, user };
    };
    const confirm = (user: UserEvent) => confirmDialog(user, rowDelete.dialog, rowDelete.confirm);

    it('removes a record after the confirmation', async () => {
      const { item, other, user } = await startDelete();
      const removed = mockEmptyEndpoint(deleteRoute.service, routeOf(item));

      await confirm(user);

      expect(await screen.findByText(rowDelete.success(item))).toBeInTheDocument();
      expect(removed.calls).toHaveLength(1);
      await waitFor(() => expect(screen.queryByText(contract.label(item))).not.toBeInTheDocument());
      expect(screen.getByText(contract.label(other))).toBeInTheDocument();
    });

    it.each<[string, (route: EndpointRef) => void, string]>([
      [
        'says why when the server refuses',
        (route) =>
          mockEndpoint(deleteRoute.service, route, { message: REFUSED_REASON }, { status: 403 }),
        REFUSED_REASON,
      ],
      [
        'falls back to its own message when the server is out of reach',
        (route) => mockNetworkError(deleteRoute.service, route),
        rowDelete.failure,
      ],
    ])('keeps the record and %s', async (_, fail, message) => {
      const { item, user } = await startDelete();
      fail(routeOf(item));

      await confirm(user);

      expect(await screen.findByText(message)).toBeInTheDocument();
      expect(screen.getByText(contract.label(item))).toBeInTheDocument();
    });

    it('asks nothing when the confirmation is dismissed', async () => {
      const { item, user } = await startDelete();
      const removed = mockEmptyEndpoint(deleteRoute.service, routeOf(item));

      await user.click(
        within(await findConfirmDialog(rowDelete.dialog)).getByText(BUTTON_TEXTS.CANCEL),
      );

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(removed.calls).toHaveLength(0);
    });
  });

  describe(`${contract.feature} bulk delete`, () => {
    /** Two records selected, with their bulk delete waiting for its confirmation. */
    const startBulkDelete = async () => {
      const items = [contract.build(), contract.build()];
      const { user } = renderPage(items);
      await pickMenuItem(user, bulkDelete.more, bulkDelete.select);
      for (const item of items) {
        await user.click(within(await findRow(contract.label(item))).getByRole('checkbox'));
      }
      await clickAction(user, bulkDelete.action);
      return { items, user };
    };
    const confirm = (user: UserEvent) => confirmDialog(user, bulkDelete.dialog, bulkDelete.confirm);

    it('deletes every selected record', async () => {
      const { items, user } = await startBulkDelete();
      const removed = items.map((item) => mockEmptyEndpoint(deleteRoute.service, routeOf(item)));

      await confirm(user);

      expect(await screen.findByText(bulkDelete.success(2))).toBeInTheDocument();
      expect(removed.map((mock) => mock.calls.length)).toEqual([1, 1]);
    });

    it('says what failed', async () => {
      const { items, user } = await startBulkDelete();
      for (const item of items) mockNetworkError(deleteRoute.service, routeOf(item));

      await confirm(user);

      expect(await screen.findByText(bulkDelete.failure)).toBeInTheDocument();
    });
  });
};
