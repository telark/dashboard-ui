import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Endpoints, SLIDE_OUT } from '../../../../../constants';
import {
  mockEndpoint,
  mockNetworkError,
  permissionsSeed,
  renderApp,
  selectOption,
} from '../../../../../test';
import { findRow } from '../../../../../test/contracts/accessPage';
import { buildGroup } from '../../../../../test/factories/groups';
import { buildRole } from '../../../../../test/factories/roles';
import { buildUser } from '../../../../../test/factories/users';
import { findPanel, waitForPanelClose } from '../../../../../test/helpers/panel';
import { mockUsersPage, renderUserRow } from '../../../../../test/helpers/accessPages';
import { USERS_CONSTANTS as UC } from '../../constants';
import type { User } from '../../models';
import MainPage from '../../pages/MainPage';
import ViewUserPanel from './ViewUserPanel';

const L = UC.LABELS;

describe('manage account state panel', () => {
  const STATE = L.PANELS.MANAGE_STATE;

  const openStatePanel = async (target: User) => {
    const { user, row } = await renderUserRow(target);
    await user.click(within(row).getByLabelText(L.ACTIONS.MANAGE_STATE));
    const panel = await findPanel();
    const save = await within(panel).findByRole('button', { name: STATE.SUBMIT_BUTTON });
    const suspend = async () => {
      await selectOption(user, STATE.FIELD_LABEL, STATE.OPTION_SUSPENDED);
      await user.click(save);
    };
    return { save, suspend };
  };

  it('saves the chosen state', async () => {
    const target = buildUser();
    const patch = mockEndpoint('exporter', Endpoints.USERS.PATCH_BY_ID(target.id), {
      data: target,
    });
    const { save, suspend } = await openStatePanel(target);
    expect(save).toBeDisabled();

    await suspend();

    expect(await screen.findByText(L.MESSAGES.UPDATED(target.fullname))).toBeInTheDocument();
    expect(patch.calls[0].body).toEqual({ status: { phase: 'suspended' } });
    await waitForPanelClose();
  });

  it('reports a failed save', async () => {
    const target = buildUser();
    mockNetworkError('exporter', Endpoints.USERS.PATCH_BY_ID(target.id));
    const { suspend } = await openStatePanel(target);

    await suspend();

    expect(await screen.findByText(L.MESSAGES.UPDATE_FAILED)).toBeInTheDocument();
  });
});

describe('user view panel', () => {
  const role = buildRole();
  const group = buildGroup();

  const openFromRow = async (target: User, seed = permissionsSeed('Admin')) => {
    mockUsersPage([target], { roles: [role], groups: [group] });
    const view = renderApp(<MainPage />, { seed });
    await view.user.click(await findRow(target.username));
    return { ...view, panel: await findPanel() };
  };

  it('shows the account with the roles and groups it holds', async () => {
    const target = buildUser({ roleRefs: [role.id], groupRefs: [group.id] });
    const { user, panel } = await openFromRow(target);

    expect(await within(panel).findByText(target.email)).toBeInTheDocument();
    await user.click(within(panel).getByRole('tab', { name: /Roles/ }));
    expect(await within(panel).findByText(new RegExp(role.name, 'i'))).toBeInTheDocument();

    await user.click(within(panel).getByRole('tab', { name: /Groups/ }));
    expect(await within(panel).findByText(new RegExp(group.name, 'i'))).toBeInTheDocument();
  });

  it('lets an owner open account state from the panel', async () => {
    const { user, panel } = await openFromRow(buildUser());

    await user.click(await within(panel).findByRole('button', { name: L.ACTIONS.MANAGE_STATE }));

    expect(await screen.findByLabelText(L.PANELS.MANAGE_STATE.FIELD_LABEL)).toBeInTheDocument();
  });

  it('turns actions off for a read-only viewer', async () => {
    const { panel } = await openFromRow(buildUser(), permissionsSeed('ReadOnly'));

    expect(
      await within(panel).findByRole('button', { name: L.ACTIONS.MANAGE_STATE }),
    ).toHaveAttribute('title', L.ACTIONS.EDIT_DISABLED_TOOLTIP);
    expect(
      within(panel).getByRole('button', { name: SLIDE_OUT.TOOLBAR_DELETE_LABEL }),
    ).toHaveAttribute('title', L.ACTIONS.DELETE_DISABLED_TOOLTIP);
  });

  it('renders nothing without a user', () => {
    mockUsersPage([]);

    renderApp(<ViewUserPanel open onClose={vi.fn()} user={null} />);

    expect(screen.queryByText(L.PANELS.VIEW.TITLE)).not.toBeInTheDocument();
  });
});
