import { screen, waitFor, within } from '@testing-library/react';
import { Form } from 'antd';
import { describe, expect, it, vi } from 'vitest';
import { Endpoints } from '../../../../../constants';
import {
  mockEndpoint,
  mockServerError,
  permissionsSeed,
  renderApp,
  fillFields,
  selectOption,
} from '../../../../../test';
import { buildRole } from '../../../../../test/factories/roles';
import { ROLE_CATEGORY as CATEGORY, mockRolesPage } from '../../../../../test/helpers/accessPages';
import { pressIn, switchFor } from '../../../../../test/helpers/accessForms';
import { findPanel } from '../../../../../test/helpers/panel';
import { pickSelectOption } from '../../../../../test/antd';
import { ROLES_CONSTANTS as RC } from '../../constants';
import type { Role, RoleFormValues } from '../../models';
import CreateRolePanel from './CreateRolePanel';

const L = RC.LABELS;
const G = RC.GENERAL;
const OWNER_OPTION = `Owner${RC.SCOPE.PERMISSION_LEVEL_DESCRIPTION.Owner}`;

const CreateHost = ({ onClose }: { onClose: () => void }) => {
  const [form] = Form.useForm<RoleFormValues>();
  return <CreateRolePanel open onClose={onClose} form={form} />;
};

describe('create role panel', () => {
  const openCreate = async () => {
    const existing = buildRole({ name: 'existing_role' });
    mockRolesPage([existing]);
    const onClose = vi.fn();
    const view = renderApp(<CreateHost onClose={onClose} />, {
      seed: { ...permissionsSeed(), roles: { roles: [existing], loaded: true } },
    });
    const panel = await findPanel();
    await within(panel).findByLabelText(G.NAME_LABEL);
    return { ...view, panel, onClose };
  };
  const fillBasics = async (
    { user }: Awaited<ReturnType<typeof openCreate>>,
    name = 'new_role',
  ) => {
    await fillFields(user, { [G.NAME_LABEL]: name, [G.DESCRIPTION_LABEL]: 'Runs releases' });
    await selectOption(user, G.CATEGORY_LABEL, CATEGORY.name);
  };
  const submit = async ({ user, panel }: Awaited<ReturnType<typeof openCreate>>) =>
    pressIn(user, panel, L.PANELS.CREATE.SUBMIT_BUTTON);
  /** Sends a new role, with the fields `customize` sets, and returns the request body. */
  const postedRole = async (
    customize: (view: Awaited<ReturnType<typeof openCreate>>) => unknown,
  ) => {
    const post = mockEndpoint('exporter', Endpoints.ROLES.CREATE, { data: buildRole() });
    const view = await openCreate();
    await fillBasics(view);
    await customize(view);
    await submit(view);
    await waitFor(() => expect(post.calls).toHaveLength(1));
    return post.calls[0].body as Role;
  };

  it('creates a read-only custom role by default', async () => {
    const created = buildRole({ name: 'new_role' });
    const post = mockEndpoint('exporter', Endpoints.ROLES.CREATE, { data: created });
    const view = await openCreate();

    await fillBasics(view);
    await submit(view);

    expect(await screen.findByText(L.MESSAGES.CREATED('new_role'))).toBeInTheDocument();
    expect(post.calls[0].body).toMatchObject({
      name: 'new_role',
      description: 'Runs releases',
      categoryRef: CATEGORY.id,
      type: 'custom',
      status: 'Active',
      validity: { type: 'permanent' },
    });
    expect((post.calls[0].body as Role).protection).toBeUndefined();
    expect((post.calls[0].body as Role).scopesAndPermissions).toHaveLength(
      RC.SCOPE.DEFAULT_AREAS.length,
    );
    expect(view.onClose).toHaveBeenCalled();
  });

  it('sends the level picked for a scope', async () => {
    const body = await postedRole(async ({ user, panel }) => {
      const [, , groupsLevel] = within(panel).getAllByRole('combobox');
      await pickSelectOption(user, groupsLevel, OWNER_OPTION);
    });

    expect(body.scopesAndPermissions).toContainEqual({
      scope: 'groups',
      level: 'Owner',
      rules: [],
    });
  });

  it('flags protection only when something is locked', async () => {
    const body = await postedRole(({ user, panel }) =>
      user.click(switchFor(panel, RC.PROTECTION.LOCK_NAME_LABEL)),
    );

    expect(body).toMatchObject({ protection: { lockName: true, preventDeletion: false } });
  });

  it('collects a temporary validity with a duration', async () => {
    const body = await postedRole(async ({ user, panel }) => {
      await selectOption(user, RC.VALIDITY.TYPE_LABEL, 'Temporary');
      await selectOption(user, RC.VALIDITY.EXPIRATION_MODEL_LABEL, 'Duration');
      await user.type(
        await within(panel).findByPlaceholderText(RC.VALIDITY.DURATION_PLACEHOLDER),
        '8',
      );
      await user.click(switchFor(panel, RC.VALIDITY.AUTO_REVOKE_LABEL));
    });

    expect(body).toMatchObject({
      validity: { type: 'temporary', durationHours: 8, autoRevoke: true },
    });
  });

  it('refuses a taken name while typing', async () => {
    const view = await openCreate();

    await fillFields(view.user, { [G.NAME_LABEL]: 'EXISTING_ROLE' });

    expect(
      await within(view.panel).findByText(G.NAME_VALIDATION.DUPLICATE_ERROR),
    ).toBeInTheDocument();
    expect(
      within(view.panel).getByRole('button', { name: L.PANELS.CREATE.SUBMIT_BUTTON }),
    ).toBeDisabled();
  });

  it('keeps the panel open when the server refuses the role', async () => {
    mockServerError('exporter', Endpoints.ROLES.CREATE, { message: 'Name reserved' });
    const view = await openCreate();

    await fillBasics(view);
    await submit(view);

    expect(await screen.findByText('Name reserved')).toBeInTheDocument();
    expect(view.onClose).not.toHaveBeenCalled();
  });

  it('asks for at least one scope', async () => {
    const view = await openCreate();

    await fillBasics(view);
    const clears = await within(view.panel).findAllByLabelText('close-circle');
    for (const clear of clears) await view.user.click(clear);
    await submit(view);

    expect(await within(view.panel).findByText(RC.SCOPE.AT_LEAST_ONE_REQUIRED)).toBeInTheDocument();
  });
});
