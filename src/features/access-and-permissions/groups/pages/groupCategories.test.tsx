import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../constants';
import { mockEmptyEndpoint, renderApp } from '../../../../test';
import { confirmDialog, findRow } from '../../../../test/contracts/accessPage';
import { buildCategory } from '../../../../test/factories/categories';
import { buildGroup } from '../../../../test/factories/groups';
import { clickAction, pickMenuItem } from '../../../../test/helpers/accessForms';
import { findPanel } from '../../../../test/helpers/panel';
import { GROUP_CATEGORY as CATEGORY, mockGroupsPage } from '../../../../test/helpers/accessPages';
import { CATEGORIES_CONSTANTS as CC } from '../../categories/constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import MainPage from './MainPage';

const L = GC.LABELS;
const CAT_L = CC.LABELS;

describe('group categories view', () => {
  const openCategories = async (categories = [CATEGORY]) => {
    mockGroupsPage([buildGroup()], categories);
    const view = renderApp(<MainPage />);
    await findRow(/platform_team/);
    await pickMenuItem(view.user, L.TOOLBAR.MORE, CAT_L.TOOLBAR.MANAGE_CATEGORIES.VIEW_CATEGORIES);
    return view;
  };

  it('lists categories and returns to groups through the breadcrumb', async () => {
    const { user } = await openCategories();

    expect(await findRow(CATEGORY.name)).toBeInTheDocument();
    await user.click(screen.getByText(L.HEADER_TITLE));
    await findRow(/platform_team/);
  });

  it('deletes a custom category after the confirmation', async () => {
    const removed = mockEmptyEndpoint('exporter', Endpoints.CATEGORIES.DELETE_BY_ID(CATEGORY.id));
    const { user } = await openCategories();

    await user.click(within(await findRow(CATEGORY.name)).getByLabelText(CAT_L.ACTIONS.DELETE));
    await confirmDialog(user, CAT_L.ACTIONS.DELETE_MODAL_TITLE, CAT_L.ACTIONS.DELETE_MODAL_OK);

    expect(await screen.findByText(CAT_L.MESSAGES.DELETED)).toBeInTheDocument();
    expect(removed.calls).toHaveLength(1);
  });

  it('protects a built-in category from changes', async () => {
    const builtIn = buildCategory({
      name: 'builtin_cat',
      scope: CC.SCOPES.GROUPS,
      type: 'built-in',
    });
    await openCategories([builtIn]);

    const row = within(await findRow(builtIn.name));
    expect(row.queryByRole('button', { name: CAT_L.ACTIONS.EDIT })).not.toBeInTheDocument();
    expect(row.queryByRole('button', { name: CAT_L.ACTIONS.DELETE })).not.toBeInTheDocument();
  });

  it('opens the panels to add and edit a category', async () => {
    const { user } = await openCategories();
    await findRow(CATEGORY.name);

    await clickAction(user, CAT_L.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY);
    expect(
      await within(await findPanel()).findByLabelText(CAT_L.PANELS.ADD_CATEGORY.NAME_LABEL),
    ).toHaveValue('');
    await clickAction(user, CAT_L.PANELS.ADD_CATEGORY.CANCEL);

    await user.click(within(await findRow(CATEGORY.name)).getByLabelText(CAT_L.ACTIONS.EDIT));
    expect(await within(await findPanel()).findByDisplayValue(CATEGORY.name)).toBeInTheDocument();
  });
});
