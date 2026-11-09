import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../../constants';
import { mockEndpoint, mockNetworkError, renderApp, fillFields } from '../../../../../test';
import { confirmDialog, findRow } from '../../../../../test/contracts/accessPage';
import { buildRole } from '../../../../../test/factories/roles';
import { buildUser } from '../../../../../test/factories/users';
import { clickAction, pressIn } from '../../../../../test/helpers/accessForms';
import { findPanel } from '../../../../../test/helpers/panel';
import { mockUsersPage } from '../../../../../test/helpers/accessPages';
import { GRANT_CONFIRM } from '../../../shared/constants/grantConfirm';
import type { Role } from '../../../roles/models';
import { USERS_CONSTANTS as UC } from '../../constants';
import type { User } from '../../models';
import MainPage from '../../pages/MainPage';

const L = UC.LABELS;

describe('create member panel', () => {
  const USERNAME = L.FORM.FIELDS.USERNAME_LABEL;
  const EMAIL = L.FORM.FIELDS.EMAIL_LABEL;
  const NEW_EMAIL = 'test+new@example.com';

  const openCreate = async (users: User[], roles: Role[] = []) => {
    mockUsersPage(users, { roles });
    const view = renderApp(<MainPage />);
    await findRow(users[0].username);
    await clickAction(view.user, L.TOOLBAR.CREATE.BUTTON_LABEL);
    const panel = await findPanel();
    await within(panel).findByLabelText(USERNAME);
    const submitNewMember = async () => {
      await fillFields(view.user, { [USERNAME]: 'new_member', [EMAIL]: NEW_EMAIL });
      await pressIn(view.user, panel, L.PANELS.CREATE.SUBMIT_BUTTON);
    };
    return { ...view, panel, submitNewMember };
  };

  const mockCreate = () =>
    mockEndpoint('exporter', Endpoints.USERS.CREATE, {
      data: buildUser({ username: 'new_member' }),
    });

  it('creates a member and adds it to the list', async () => {
    const mock = mockCreate();
    const { submitNewMember } = await openCreate([buildUser()]);

    await submitNewMember();

    expect(await screen.findByText(L.MESSAGES.CREATED('new_member'))).toBeInTheDocument();
    expect(mock.calls[0].body).toEqual({
      username: 'new_member',
      fullname: 'new member',
      email: NEW_EMAIL,
      roleRefs: [],
      groupRefs: [],
    });
    await findRow('new_member');
  });

  it.each([
    [USERNAME, 'taken_name', L.VALIDATION.USERNAME_TAKEN],
    [EMAIL, 'not-an-email', L.VALIDATION.INVALID_EMAIL],
  ])('refuses a bad %s while typing', async (field, value, message) => {
    const { user, panel } = await openCreate([buildUser({ username: 'taken_name' })]);

    await fillFields(user, { [field]: value });

    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(
      within(panel).getByRole('button', { name: L.PANELS.CREATE.SUBMIT_BUTTON }),
    ).toBeDisabled();
  });

  it('keeps the panel open and reports a refused save', async () => {
    mockNetworkError('exporter', Endpoints.USERS.CREATE);
    const { panel, submitNewMember } = await openCreate([buildUser()]);

    await submitNewMember();

    expect(await screen.findByText(L.MESSAGES.CREATE_FAILED)).toBeInTheDocument();
    expect(within(panel).getByLabelText(USERNAME)).toHaveValue('new_member');
  });

  it('asks before granting Owner to a new member', async () => {
    const mock = mockCreate();
    const wideRole = buildRole({
      name: 'Owner_role',
      scopesAndPermissions: [{ scope: 'groups', level: 'Owner' }],
    });
    const { user, panel, submitNewMember } = await openCreate([buildUser()], [wideRole]);

    await user.click(await within(panel).findByRole('checkbox', { name: /Owner_role/ }));
    await submitNewMember();
    await confirmDialog(
      user,
      GRANT_CONFIRM.TITLE('Owner', 'Groups', 'new_member'),
      GRANT_CONFIRM.ACTION('Owner'),
    );

    expect(await screen.findByText(L.MESSAGES.CREATED('new_member'))).toBeInTheDocument();
    expect(mock.calls[0].body).toMatchObject({ roleRefs: [wideRole.id] });
  });
});
