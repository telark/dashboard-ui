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
import { buildGroup } from '../../../../test/factories/groups';
import {
  GROUP_CATEGORY as CATEGORY,
  mockGroupsPage,
  renderGroups,
} from '../../../../test/helpers/accessPages';
import { clickAction } from '../../../../test/helpers/accessForms';
import { findPanel } from '../../../../test/helpers/panel';
import { GROUPS_CONSTANTS as GC } from '../constants';
import type { Group } from '../models';
import MainPage from './MainPage';

const L = GC.LABELS;

describeAccessPage<Group>({
  feature: 'groups',
  page: <MainPage />,
  build: buildGroup,
  label: (group) => group.name,
  mockPage: mockGroupsPage,
  listRoute: Endpoints.GROUPS.GET_ALL,
  emptyTitle: L.MESSAGES.NO_GROUPS_TITLE,
  deleteRoute: { service: 'auth', endpoint: Endpoints.GROUPS.CLEANUP },
  ...standardDeleteFlows<Group>(L, () => L.MESSAGES.DELETED),
});

describe('groups page list', () => {
  it('searches and filters by category', async () => {
    const kept = buildGroup({ name: 'alpha_team', categoryRef: CATEGORY.id });
    const dropped = buildGroup({ name: 'beta_team' });
    const { user } = renderGroups([kept, dropped]);
    await findRow(kept.name);

    await searchList(user, L.TOOLBAR.SEARCH.PLACEHOLDER, 'alpha');
    await waitFor(() => expect(screen.queryByText(dropped.name)).not.toBeInTheDocument());
    await user.clear(screen.getByPlaceholderText(L.TOOLBAR.SEARCH.PLACEHOLDER));
    await findRow(dropped.name);

    expect(await filterThenClear(user, CATEGORY.name, dropped.name)).toBeInTheDocument();
  });

  it('disables creating and row actions for a viewer', async () => {
    const group = buildGroup();
    renderGroups([group, buildGroup()], permissionsSeed('ReadOnly'));

    const row = within(await findRow(group.name));
    expect(row.getByRole('button', { name: L.ACTIONS.EDIT })).toBeDisabled();
    expect(row.getByRole('button', { name: L.ACTIONS.DELETE })).toBeDisabled();
    expect(screen.getByRole('button', { name: new RegExp(L.FORM.BUTTON_TEXT) })).toBeDisabled();
  });

  it('starts from the empty page and opens create from it', async () => {
    const { user } = renderGroups([]);
    await screen.findByText(L.MESSAGES.NO_GROUPS_TITLE);

    await clickAction(user, L.FORM.BUTTON_TEXT);

    expect(
      await within(await findPanel()).findByRole('button', { name: L.FORM.BUTTON_TEXT }),
    ).toBeInTheDocument();
  });
});
