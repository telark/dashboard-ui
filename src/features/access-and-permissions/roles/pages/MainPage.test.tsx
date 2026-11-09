import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../constants';
import { searchList } from '../../../../test';
import { describeAccessPage } from '../../../../test/contracts/accessPage';
import { buildRole } from '../../../../test/factories/roles';
import { mockRolesPage, renderRoles } from '../../../../test/helpers/accessPages';
import { ROLES_CONSTANTS } from '../constants';
import type { Role } from '../models';
import MainPage from './MainPage';

const RL = ROLES_CONSTANTS.LABELS;

describeAccessPage<Role>({
  feature: 'roles',
  page: <MainPage />,
  build: buildRole,
  label: (role) => role.name,
  mockPage: mockRolesPage,
  listRoute: Endpoints.ROLES.GET_ALL,
  emptyTitle: RL.NO_ROLES_TITLE,
  deleteRoute: { service: 'auth', endpoint: Endpoints.ROLES.CLEANUP },
  rowDelete: {
    action: RL.ACTIONS.DELETE,
    dialog: RL.DELETE_MODAL_TITLE,
    confirm: RL.DELETE_MODAL_OK,
    success: () => RL.MESSAGES.DELETED,
    failure: RL.MESSAGES.DELETE_FAILED,
  },
  bulkDelete: {
    more: RL.TOOLBAR.MORE,
    select: RL.TOOLBAR.BULK.SELECT,
    action: RL.ACTIONS.BULK_DELETE,
    dialog: RL.ACTIONS.BULK_DELETE_MODAL_TITLE,
    confirm: RL.DELETE_MODAL_OK,
    success: RL.ACTIONS.BULK_DELETE_SUCCESS,
    failure: RL.ACTIONS.BULK_DELETE_FAILED,
  },
});

describe('roles page search', () => {
  it('keeps only the roles that match', async () => {
    const [kept, dropped] = [buildRole({ name: 'alpha_lead' }), buildRole({ name: 'beta_lead' })];
    const { user } = renderRoles([kept, dropped]);
    await screen.findByText(kept.name);

    await searchList(user, RL.TOOLBAR.SEARCH.PLACEHOLDER, 'alpha');

    await waitFor(() => expect(screen.queryByText(dropped.name)).not.toBeInTheDocument());
    expect(screen.getByText(kept.name)).toBeInTheDocument();
  });
});
