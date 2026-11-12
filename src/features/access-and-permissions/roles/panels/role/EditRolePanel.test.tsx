import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BUTTON_TEXTS, Endpoints } from '../../../../../constants';
import {
  mockEndpoint,
  mockServerError,
  permissionsSeed,
  renderApp,
  fillFields,
} from '../../../../../test';
import { findRow } from '../../../../../test/contracts/accessPage';
import { buildRole } from '../../../../../test/factories/roles';
import {
  ROLE_CATEGORY as CATEGORY,
  mockRolesPage,
  renderRoles,
} from '../../../../../test/helpers/accessPages';
import { switchFor } from '../../../../../test/helpers/accessForms';
import { findPanel } from '../../../../../test/helpers/panel';
import { ROLES_CONSTANTS as RC } from '../../constants';
import type { Role } from '../../models';
import EditRolePanel from './EditRolePanel';

const L = RC.LABELS;
const G = RC.GENERAL;

describe('edit role panel', () => {
  const setup = async (role: Role, seed = permissionsSeed('Admin')) => {
    mockRolesPage([role]);
    const onClose = vi.fn();
    const view = renderApp(<EditRolePanel open onClose={onClose} editingRole={role} />, { seed });
    const panel = await findPanel();
    await within(panel).findByLabelText(G.NAME_LABEL);
    const save = () => within(panel).getByRole('button', { name: BUTTON_TEXTS.SAVE_CHANGES });
    return { ...view, panel, onClose, save };
  };
  const role = () => buildRole({ name: 'edit_role', description: 'old', categoryRef: CATEGORY.id });
  const setupProtected = async (protection: Role['protection']) => {
    const target = { ...role(), protection, createdBy: 'user-under-test' };
    const patch = mockEndpoint('exporter', Endpoints.ROLES.PATCH_BY_ID(target.id), {
      data: target,
    });
    return { ...(await setup(target)), patch };
  };

  it('sends only what changed and closes', async () => {
    const target = role();
    const patch = mockEndpoint('exporter', Endpoints.ROLES.PATCH_BY_ID(target.id), {
      data: { ...target, description: 'new text' },
    });
    const { user, save, onClose } = await setup(target);
    expect(save()).toBeDisabled();

    await fillFields(user, { [G.DESCRIPTION_LABEL]: 'new text' });
    await user.click(save());

    expect(await screen.findByText(L.MESSAGES.UPDATED(target.name))).toBeInTheDocument();
    expect(patch.calls[0].body).toEqual({ description: 'new text' });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('keeps the panel open when the server refuses the change', async () => {
    const target = role();
    mockServerError('exporter', Endpoints.ROLES.PATCH_BY_ID(target.id), { message: 'Role locked' });
    const { user, save, onClose } = await setup(target);

    await fillFields(user, { [G.DESCRIPTION_LABEL]: 'new text' });
    await user.click(save());

    expect(await screen.findByText('Role locked')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('lifts a lock first, then writes the field it guarded', async () => {
    const { user, panel, save, patch } = await setupProtected({ lockName: true });
    expect(within(panel).getByLabelText(G.NAME_LABEL)).toBeDisabled();

    await user.click(switchFor(panel, RC.PROTECTION.LOCK_NAME_LABEL));
    await waitFor(() => expect(within(panel).getByLabelText(G.NAME_LABEL)).toBeEnabled());
    await fillFields(user, { [G.NAME_LABEL]: 'renamed_role' });
    await user.click(save());

    await waitFor(() => expect(patch.calls).toHaveLength(2));
    expect(patch.calls[0].body).toMatchObject({ protection: { lockName: false } });
    expect(patch.calls[1].body).toEqual({ name: 'renamed_role' });
  });

  it('keeps a role with prevented modification editable only in protection', async () => {
    const { user, panel, save, patch } = await setupProtected({ preventModification: true });

    expect(within(panel).getByLabelText(G.NAME_LABEL)).toBeDisabled();

    await user.click(switchFor(panel, RC.PROTECTION.SOFT_DELETE_LABEL));
    await user.click(save());

    await waitFor(() => expect(patch.calls).toHaveLength(1));
    expect(Object.keys(patch.calls[0].body as object)).toEqual(['protection']);
  });

  it('shows protection read-only to someone who cannot change it', async () => {
    const target = { ...role(), createdBy: 'someone_else', protection: { lockName: true } };
    const { panel } = await setup(target, permissionsSeed('Owner'));

    expect(within(panel).getByText(RC.PROTECTION.TITLE)).toBeInTheDocument();
    expect(within(panel).queryByRole('switch')).not.toBeInTheDocument();
  });

  it('renders nothing without a role', () => {
    mockRolesPage([]);

    renderApp(<EditRolePanel open onClose={vi.fn()} editingRole={null} />);

    expect(
      screen.queryByRole('button', { name: BUTTON_TEXTS.SAVE_CHANGES }),
    ).not.toBeInTheDocument();
  });
});

describe('role view panel', () => {
  const openView = async (role: Role, seed = permissionsSeed('Admin')) => {
    mockEndpoint('exporter', Endpoints.USERS.GET_NAMES(['u-owner']), {
      data: { 'u-owner': 'release_lead' },
    });
    const view = renderRoles([role], seed);
    await view.user.click(await findRow(role.name));
    return { ...view, panel: await findPanel() };
  };

  it('shows the details and the scopes tab', async () => {
    const role = buildRole({
      name: 'viewed_role',
      categoryRef: CATEGORY.id,
      createdBy: 'u-owner',
      validity: { type: 'sessionBased' },
      scopesAndPermissions: [{ scope: 'applications', level: 'Admin', rules: ['editapplication'] }],
    });
    const { panel, user } = await openView(role);

    expect(await within(panel).findByText(CATEGORY.name)).toBeInTheDocument();
    expect(within(panel).getByText('Session Based')).toBeInTheDocument();
    expect(await within(panel).findByText('release_lead')).toBeInTheDocument();

    await user.click(within(panel).getByRole('tab', { name: /Scopes/ }));

    expect(await within(panel).findByText('Applications')).toBeInTheDocument();
  });

  it('opens the edit panel from the view panel', async () => {
    const role = buildRole({ name: 'viewed_role', categoryRef: CATEGORY.id });
    const { user, panel } = await openView(role);

    await user.click(await within(panel).findByRole('button', { name: /Edit/ }));

    expect(await screen.findByLabelText(G.NAME_LABEL)).toHaveValue(role.name);
  });
});
