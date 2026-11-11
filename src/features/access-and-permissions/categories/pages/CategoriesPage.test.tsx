import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { NO_PERMISSION_CONSTANTS } from '../../../../components/shared';
import { APP_ROUTES, Endpoints, HTTP_STATUS } from '../../../../constants';
import {
  clickAction,
  currentLocation,
  mockEmptyEndpoint,
  mockEndpoint,
  mockServerError,
  permissionsSeed,
  renderApp,
  type StoreSeed,
} from '../../../../test';
import { confirmDialog, findRow } from '../../../../test/contracts/accessPage';
import { buildCategory } from '../../../../test/factories/categories';
import { findPanel } from '../../../../test/helpers/panel';
import { ACTION_PERMISSIONS } from '../../../auth/hooks';
import { CATEGORIES_CONSTANTS as CC, labelsFor } from '../constants';
import type { CategoryScope } from '../constants';
import type { Category } from '../models';
import { categoriesPageRoute } from '../utils';
import CategoriesPage from './CategoriesPage';

const ALL_SCOPES = Object.values(CC.SCOPES);
const GROUPS = CC.SCOPES.GROUPS;

const tabOf = (scope: CategoryScope) => {
  const tab = CC.PAGE.TABS.find(({ value }) => value === scope);
  if (!tab) throw new Error(`No tab for ${scope}`);
  return tab;
};

const categoryIn = (scope: CategoryScope, overrides: Partial<Category> = {}) =>
  buildCategory({ id: 'cat-ops', name: 'ops_category', scope, ...overrides });

const mockScope = (scope: CategoryScope, categories: Category[]) =>
  mockEndpoint('exporter', Endpoints.CATEGORIES.GET_BY_SCOPE(scope), {
    data: { items: categories },
  });

const renderScope = (
  scope: CategoryScope,
  categories: Category[] = [categoryIn(scope)],
  seed: StoreSeed = permissionsSeed(),
) => {
  const list = mockScope(scope, categories);
  return { list, ...renderApp(<CategoriesPage />, { route: categoriesPageRoute(scope), seed }) };
};

const deleteCategoryRow = async (name: string, scope: CategoryScope, user: UserEvent) => {
  const L = labelsFor(scope);
  await user.click(within(await findRow(name)).getByLabelText(L.ACTIONS.DELETE));
  await confirmDialog(user, L.ACTIONS.DELETE_MODAL_TITLE, L.ACTIONS.DELETE_MODAL_OK);
};

describe('categories page', () => {
  it.each(ALL_SCOPES)('lists the %s of the type in the URL', async (scope) => {
    renderScope(scope);

    expect(await findRow('ops_category')).toBeInTheDocument();
  });

  it('opens the first type for a type the page does not know', async () => {
    mockScope(GROUPS, [categoryIn(GROUPS)]);

    renderApp(<CategoriesPage />, { route: `${APP_ROUTES.CATEGORIES}?${CC.PAGE.TYPE_PARAM}=none` });

    expect(await findRow('ops_category')).toBeInTheDocument();
  });

  it('switches type from the tabs and keeps it in the URL', async () => {
    const { user } = renderScope(GROUPS);
    await findRow('ops_category');
    mockScope(CC.SCOPES.PLAN_TAGS, [categoryIn(CC.SCOPES.PLAN_TAGS, { name: 'audit_tag' })]);

    await user.click(screen.getByText(tabOf(CC.SCOPES.PLAN_TAGS).label));

    expect(await findRow('audit_tag')).toBeInTheDocument();
    expect(currentLocation()).toBe(categoriesPageRoute(CC.SCOPES.PLAN_TAGS));
  });

  it.each(ALL_SCOPES)('deletes a custom %s after the confirmation', async (scope) => {
    const category = categoryIn(scope);
    const removed = mockEmptyEndpoint('exporter', Endpoints.CATEGORIES.DELETE_BY_ID(category.id));
    const { user } = renderScope(scope);

    await deleteCategoryRow(category.name, scope, user);

    expect(await screen.findByText(labelsFor(scope).MESSAGES.DELETED)).toBeInTheDocument();
    expect(removed.calls).toHaveLength(1);
  });

  it('shows why the server refused to delete a category in use', async () => {
    const category = categoryIn(GROUPS);
    const reason = 'Items still using this category: 3. Move them to another category first';
    mockEndpoint(
      'exporter',
      Endpoints.CATEGORIES.DELETE_BY_ID(category.id),
      { message: reason },
      { status: HTTP_STATUS.CONFLICT },
    );
    const { user } = renderScope(GROUPS);

    await deleteCategoryRow(category.name, GROUPS, user);

    expect(await screen.findByText(reason)).toBeInTheDocument();
  });

  it('keeps the generic message for any other failed delete', async () => {
    const category = categoryIn(GROUPS);
    mockServerError('exporter', Endpoints.CATEGORIES.DELETE_BY_ID(category.id), {
      message: 'internal detail',
    });
    const { user } = renderScope(GROUPS);

    await deleteCategoryRow(category.name, GROUPS, user);

    expect(await screen.findByText(labelsFor(GROUPS).MESSAGES.DELETE_FAILED)).toBeInTheDocument();
    expect(screen.queryByText('internal detail')).not.toBeInTheDocument();
  });

  it('protects a built-in category from changes', async () => {
    const builtIn = categoryIn(GROUPS, { name: 'builtin_cat', type: 'built-in' });
    renderScope(GROUPS, [builtIn]);

    const row = within(await findRow(builtIn.name));
    expect(row.queryByRole('button', { name: CC.LABELS.ACTIONS.EDIT })).not.toBeInTheDocument();
    expect(row.queryByRole('button', { name: CC.LABELS.ACTIONS.DELETE })).not.toBeInTheDocument();
  });

  it('opens the panels to add and edit a category', async () => {
    const category = categoryIn(GROUPS);
    const L = labelsFor(GROUPS);
    const { user } = renderScope(GROUPS);
    await findRow(category.name);

    await clickAction(user, L.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY);
    expect(
      await within(await findPanel()).findByLabelText(L.PANELS.ADD_CATEGORY.NAME_LABEL),
    ).toHaveValue('');
    await clickAction(user, L.PANELS.ADD_CATEGORY.CANCEL);

    await user.click(within(await findRow(category.name)).getByLabelText(L.ACTIONS.EDIT));
    expect(await within(await findPanel()).findByDisplayValue(category.name)).toBeInTheDocument();
  });

  it.each([
    [GROUPS, ACTION_PERMISSIONS.groups.viewCategories.deny],
    [CC.SCOPES.ROLES, ACTION_PERMISSIONS.roles.viewCategories.deny],
    [CC.SCOPES.PLAN_KINDS, ACTION_PERMISSIONS.protectionPlans.view.deny],
  ])('shows no access on %s and asks nothing of the server', async (scope, deny) => {
    const { list } = renderScope(scope, undefined, permissionsSeed('Owner', [deny]));

    expect(
      await screen.findByText(NO_PERMISSION_CONSTANTS.LABELS.TITLE(tabOf(scope).featureName)),
    ).toBeInTheDocument();
    await waitFor(() => expect(list.calls).toHaveLength(0));
  });
});
