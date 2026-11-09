import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BUTTON_TEXTS, Endpoints } from '../../../../constants';
import { mockEndpoint, mockNetworkError, fillFields } from '../../../../test';
import { findRow } from '../../../../test/contracts/accessPage';
import { buildGroup } from '../../../../test/factories/groups';
import { clickAction, pickMenuItem, pressIn } from '../../../../test/helpers/accessForms';
import { findPanel } from '../../../../test/helpers/panel';
import { GROUP_CATEGORY as CATEGORY, renderGroups } from '../../../../test/helpers/accessPages';
import { pickSelectOption } from '../../../../test/antd';
import { GROUPS_CONSTANTS as GC } from '../constants';
import type { Group } from '../models';

const L = GC.LABELS;

describe('group form panels', () => {
  const NAME = L.FORM.FIELDS.NAME_LABEL;
  const DESCRIPTION = L.FORM.FIELDS.DESCRIPTION_LABEL;

  const openCreate = async (groups: Group[]) => {
    const view = renderGroups(groups);
    await findRow(groups[0].name);
    await clickAction(view.user, L.FORM.BUTTON_TEXT);
    const panel = await findPanel();
    await within(panel).findByLabelText(NAME);
    const submitNewTeam = async (description: string) => {
      await fillFields(view.user, { [NAME]: 'new_team', [DESCRIPTION]: description });
      await pickSelectOption(view.user, within(panel).getByRole('combobox'), CATEGORY.name);
      await pressIn(view.user, panel, L.FORM.BUTTON_TEXT);
    };
    return { ...view, panel, submitNewTeam };
  };

  it('creates a group and refreshes its details', async () => {
    const existing = buildGroup();
    const created = buildGroup({ name: 'new_team', categoryRef: CATEGORY.id });
    const post = mockEndpoint('exporter', Endpoints.GROUPS.CREATE, { data: created });
    const details = mockEndpoint('exporter', Endpoints.GROUPS.GET_BY_ID(created.id), {
      data: created,
    });
    const { submitNewTeam } = await openCreate([existing]);

    await submitNewTeam(' Runs it ');

    expect(await screen.findByText(L.MESSAGES.CREATED('new_team'))).toBeInTheDocument();
    expect(post.calls[0].body).toEqual({
      name: 'new_team',
      description: 'Runs it',
      categoryRef: CATEGORY.id,
      userRefs: [],
    });
    await waitFor(() => expect(details.calls).toHaveLength(1));
    await findRow('new_team');
  });

  it('refuses a taken name while typing', async () => {
    const { user, panel } = await openCreate([buildGroup({ name: 'taken_team' })]);

    await fillFields(user, { [NAME]: 'taken_team' });

    expect(
      await within(panel).findByText(L.FORM.FIELDS.NAME_VALIDATION.DUPLICATE_ERROR),
    ).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: L.FORM.BUTTON_TEXT })).toBeDisabled();
  });

  it('saves only the changed fields of a group', async () => {
    const group = buildGroup({
      name: 'old_team',
      description: 'Runs it',
      categoryRef: CATEGORY.id,
    });
    const patch = mockEndpoint('exporter', Endpoints.GROUPS.PATCH_BY_ID(group.id), {
      data: { ...group, name: 'renamed_team' },
    });
    mockEndpoint('exporter', Endpoints.GROUPS.GET_BY_ID(group.id), {
      data: { ...group, name: 'renamed_team' },
    });
    const { user } = renderGroups([group]);

    await user.click(within(await findRow(group.name)).getByLabelText(L.ACTIONS.EDIT));
    const panel = await findPanel();
    await within(panel).findByLabelText(NAME);
    expect(within(panel).getByRole('button', { name: BUTTON_TEXTS.SAVE_CHANGES })).toBeDisabled();
    await fillFields(user, { [NAME]: 'renamed_team' });
    await pressIn(user, panel, BUTTON_TEXTS.SAVE_CHANGES);

    expect(await screen.findByText(L.MESSAGES.UPDATED('renamed_team'))).toBeInTheDocument();
    expect(patch.calls[0].body).toEqual({ name: 'renamed_team' });
  });

  it('reports a failed create', async () => {
    mockNetworkError('exporter', Endpoints.GROUPS.CREATE);
    const { submitNewTeam } = await openCreate([buildGroup()]);

    await submitNewTeam('d');

    expect(await screen.findByText(L.MESSAGES.CREATE_FAILED)).toBeInTheDocument();
  });
});

describe('group view panel', () => {
  it('opens from a row with the group details and tabs', async () => {
    const group = buildGroup({ description: 'd'.repeat(120), categoryRef: CATEGORY.id });
    const { user } = renderGroups([group]);

    await user.click(await findRow(group.name));
    const panel = await findPanel();

    expect(await within(panel).findByText(CATEGORY.name)).toBeInTheDocument();
    expect(
      within(panel).getByRole('tab', { name: new RegExp(L.PANELS.VIEW.TABS.MEMBERS) }),
    ).toBeInTheDocument();
    expect(
      within(panel).getByRole('tab', { name: new RegExp(L.PANELS.VIEW.TABS.ROLES) }),
    ).toBeInTheDocument();
  });
});

describe('group manage shortcuts', () => {
  const selectOne = async (group: Group) => {
    const view = renderGroups([group, buildGroup()]);
    await findRow(group.name);
    await pickMenuItem(view.user, L.TOOLBAR.MORE, L.TOOLBAR.BULK.SELECT);
    await view.user.click(within(await findRow(group.name)).getByRole('checkbox'));
    return view;
  };

  it.each([
    ['roles', L.ACTIONS.MANAGE_ROLES, L.PANELS.ATTACH_ROLES.TITLE],
    ['members', L.ACTIONS.MANAGE_MEMBERS, L.PANELS.ASSIGN_MEMBERS.TITLE],
  ])('opens the %s panel for the selected group', async (_, item, title) => {
    const group = buildGroup({ name: 'managed_team' });
    const { user } = await selectOne(group);

    await pickMenuItem(user, L.TOOLBAR.MANAGE.BUTTON_LABEL, item);

    expect(within(await findPanel()).getByText(new RegExp(title))).toBeInTheDocument();
  });
});
