import type { ReactElement } from 'react';
import { Endpoints } from '../../constants';
import { CATEGORIES_CONSTANTS as CC } from '../../features/access-and-permissions/categories/constants';
import type { Category } from '../../features/access-and-permissions/categories/models';
import type { Group } from '../../features/access-and-permissions/groups/models';
import GroupsPage from '../../features/access-and-permissions/groups/pages/MainPage';
import type { Role } from '../../features/access-and-permissions/roles/models';
import RolesPage from '../../features/access-and-permissions/roles/pages/MainPage';
import type { User } from '../../features/access-and-permissions/users/models';
import UsersPage from '../../features/access-and-permissions/users/pages/MainPage';
import { mockEmptyLists, mockEndpoint, mockList } from '../api';
import { findRow, mockPermissionsRefresh } from '../contracts/accessPage';
import { buildCategory } from '../factories/categories';
import { renderApp } from '../render';
import { permissionsSeed, type StoreSeed } from '../store';

export const GROUP_CATEGORY = buildCategory({
  id: 'cat-ops',
  name: 'ops_category',
  scope: CC.SCOPES.GROUPS,
});

export const ROLE_CATEGORY = buildCategory({
  id: 'cat-ops',
  name: 'ops_category',
  scope: CC.SCOPES.ROLES,
});

/** The reads and permission refresh of the Members page. */
export const mockUsersPage = (
  users: User[],
  { roles = [], groups = [] }: { roles?: Role[]; groups?: Group[] } = {},
) => {
  mockPermissionsRefresh();
  mockList('exporter', Endpoints.GROUPS.GET_ALL, groups);
  mockList('exporter', Endpoints.ROLES.GET_ALL, roles);
  mockList('exporter', Endpoints.USERS.GET_ALL, users);
};

/** The reads and permission refresh of the Groups page. */
export const mockGroupsPage = (groups: Group[], categories: Category[] = [GROUP_CATEGORY]) => {
  mockPermissionsRefresh();
  mockEmptyLists('exporter', [Endpoints.USERS.GET_ALL, Endpoints.ROLES.GET_ALL]);
  mockEndpoint('exporter', Endpoints.CATEGORIES.GET_BY_SCOPE(CC.SCOPES.GROUPS), {
    data: { items: categories },
  });
  mockList('exporter', Endpoints.GROUPS.GET_ALL, groups);
};

/** The reads and permission refresh of the Roles page. */
export const mockRolesPage = (roles: Role[], categories: Category[] = [ROLE_CATEGORY]) => {
  mockPermissionsRefresh();
  mockEmptyLists('exporter', [Endpoints.USERS.GET_ALL, Endpoints.GROUPS.GET_ALL]);
  mockEndpoint('exporter', Endpoints.CATEGORIES.GET_BY_SCOPE(CC.SCOPES.ROLES), {
    data: { items: categories },
  });
  mockList('exporter', Endpoints.ROLES.GET_ALL, roles);
};

/** A list page's `render(items, seed)`: mocks its reads, then renders it for that user. */
const pageRenderer =
  <TItem,>(page: ReactElement, mockPage: (items: TItem[]) => void) =>
  (items: TItem[], seed: StoreSeed = permissionsSeed()) => {
    mockPage(items);
    return renderApp(page, { seed });
  };

export const renderUsers = pageRenderer<User>(<UsersPage />, mockUsersPage);
export const renderGroups = pageRenderer<Group>(<GroupsPage />, mockGroupsPage);
export const renderRoles = pageRenderer<Role>(<RolesPage />, mockRolesPage);

/** The Members page with one record on it, as an Admin by default, and that record's row. */
export const renderUserRow = async (target: User, seed: StoreSeed = permissionsSeed('Admin')) => {
  const view = renderUsers([target], seed);
  return { ...view, row: await findRow(target.username) };
};
