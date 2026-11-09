import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../constants';
import { permissionsSeed, searchList } from '../../../../test';
import {
  describeAccessPage,
  filterThenClear,
  findRow,
  standardDeleteFlows,
} from '../../../../test/contracts/accessPage';
import { mockUsersPage, renderUsers } from '../../../../test/helpers/accessPages';
import { buildUser } from '../../../../test/factories/users';
import { signIn } from '../../../../test/helpers/session';
import type { User } from '../models';
import { USERS_CONSTANTS as UC } from '../constants';
import MainPage from './MainPage';

const L = UC.LABELS;

describeAccessPage<User>({
  feature: 'users',
  page: <MainPage />,
  build: buildUser,
  label: (user) => user.username,
  mockPage: mockUsersPage,
  listRoute: Endpoints.USERS.GET_ALL,
  emptyTitle: L.MESSAGES.NO_USERS_TITLE,
  deleteRoute: { service: 'auth', endpoint: Endpoints.USERS.CLEANUP },
  ...standardDeleteFlows<User>(L, (user) => L.MESSAGES.DELETED(user.fullname)),
});

describe('users page list', () => {
  it('hides the signed-in user and the bootstrap admin, and shows the others', async () => {
    const self = signIn({ username: 'signed_in' });
    const bootstrap = buildUser({ username: 'chart_admin', bootstrap: true });
    const other = buildUser({ username: 'sre_oncall' });

    renderUsers([self, bootstrap, other]);

    await findRow(other.username);
    expect(screen.queryByText(self.username)).not.toBeInTheDocument();
    expect(screen.queryByText(bootstrap.username)).not.toBeInTheDocument();
  });

  it('searches by username', async () => {
    const [kept, dropped] = [
      buildUser({ username: 'alpha_oncall' }),
      buildUser({ username: 'beta_oncall' }),
    ];
    const { user } = renderUsers([kept, dropped]);
    await findRow(kept.username);

    await searchList(user, L.TOOLBAR.SEARCH.PLACEHOLDER, 'alpha');

    await waitFor(() => expect(screen.queryByText(dropped.username)).not.toBeInTheDocument());
    expect(screen.getByText(kept.username)).toBeInTheDocument();
  });

  it('sorts by a column header', async () => {
    const [first, second] = [buildUser({ username: 'b_user' }), buildUser({ username: 'a_user' })];
    const { user } = renderUsers([first, second]);
    await findRow(first.username);

    await user.click(within(screen.getAllByRole('row')[0]).getByText(L.COLUMNS.USERNAME));

    await waitFor(() => {
      const rows = screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent);
      expect(rows[0]).toContain('a_user');
    });
  });

  it('shows a read-only viewer the page with its actions disabled', async () => {
    const target = buildUser();
    renderUsers([target, buildUser()], permissionsSeed('ReadOnly'));

    const row = within(await findRow(target.username));
    expect(row.getByRole('button', { name: L.ACTIONS.DELETE })).toBeDisabled();
    expect(row.getByRole('button', { name: L.ACTIONS.MANAGE_STATE })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: new RegExp(L.TOOLBAR.CREATE.BUTTON_LABEL) }),
    ).toBeDisabled();
  });
});

describe('users page filters', () => {
  it('filters by state, shows a chip and clears it', async () => {
    const [active, suspended] = [
      buildUser({ username: 'active_oncall' }),
      buildUser({ username: 'suspended_oncall', status: { phase: 'suspended' } }),
    ];
    const { user } = renderUsers([active, suspended]);
    await findRow(active.username);

    expect(
      await filterThenClear(user, L.FILTER.STATUS_OPTIONS.INACTIVE, active.username),
    ).toBeInTheDocument();
  });
});
