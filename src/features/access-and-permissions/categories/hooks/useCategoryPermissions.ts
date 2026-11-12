import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../auth/hooks/permissions/permissionEngine';
import type { RequiredPermission } from '../../../../interfaces/shared';
import { CATEGORIES_CONSTANTS as CC } from '../constants';
import type { CategoryScope } from '../constants';

const { groups, roles, protectionPlans } = ACTION_PERMISSIONS;

type CategoryPermissions = Record<'view' | 'add' | 'edit' | 'delete', RequiredPermission>;

const PLAN_PERMISSIONS: CategoryPermissions = {
  view: protectionPlans.view,
  add: protectionPlans.addCategory,
  edit: protectionPlans.editCategory,
  delete: protectionPlans.deleteCategory,
};

const PERMISSIONS_BY_SCOPE: Record<CategoryScope, CategoryPermissions> = {
  [CC.SCOPES.GROUPS]: {
    view: groups.viewCategories,
    add: groups.addCategory,
    edit: groups.editCategory,
    delete: groups.deleteCategory,
  },
  [CC.SCOPES.ROLES]: {
    view: roles.viewCategories,
    add: roles.addCategory,
    edit: roles.editCategory,
    delete: roles.deleteCategory,
  },
  [CC.SCOPES.PLAN_KINDS]: PLAN_PERMISSIONS,
  [CC.SCOPES.PLAN_ENVIRONMENTS]: PLAN_PERMISSIONS,
  [CC.SCOPES.PLAN_TAGS]: PLAN_PERMISSIONS,
};

export const useCategoryPermissions = (scope: CategoryScope) => {
  const { view, add, edit, delete: del } = PERMISSIONS_BY_SCOPE[scope];
  return {
    viewPermission: view,
    canView: usePermission(view.scope, view.level, view.deny),
    canAdd: usePermission(add.scope, add.level, add.deny),
    canEdit: usePermission(edit.scope, edit.level, edit.deny),
    canDelete: usePermission(del.scope, del.level, del.deny),
  };
};
