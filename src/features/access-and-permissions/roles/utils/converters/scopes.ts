import type { ScopeAndPermissions, RoleScopePermission, PermissionLevel } from '../../models';
import { ROLES_CONSTANTS } from '../../constants';

export const convertScopesToAPI = (
  scopes: Record<string, RoleScopePermission[]>,
): ScopeAndPermissions[] => {
  return Object.entries(scopes)
    .filter(([, permissions]) => permissions && permissions.length > 0)
    .map(([scope, permissions]) => {
      let level: PermissionLevel = ROLES_CONSTANTS.PERMISSION_LEVEL.READ_ONLY;
      if (permissions.includes('Delete')) {
        level = ROLES_CONSTANTS.PERMISSION_LEVEL.OWNER;
      } else if (permissions.includes('Edit')) {
        level = ROLES_CONSTANTS.PERMISSION_LEVEL.CONTRIBUTOR;
      }

      return {
        scope,
        level,
      };
    });
};

export const convertScopesFromAPI = (
  scopesAndPermissions: ScopeAndPermissions[],
): Record<string, RoleScopePermission[]> => {
  const result: Record<string, RoleScopePermission[]> = {};
  scopesAndPermissions.forEach(({ scope, level }) => {
    const permissions: RoleScopePermission[] = [];
    if (level === ROLES_CONSTANTS.PERMISSION_LEVEL.READ_ONLY) {
      permissions.push('View');
    } else if (level === ROLES_CONSTANTS.PERMISSION_LEVEL.CONTRIBUTOR) {
      permissions.push('View', 'Edit');
    } else if (level === ROLES_CONSTANTS.PERMISSION_LEVEL.OWNER) {
      permissions.push('View', 'Edit', 'Delete');
    } else if (level === ROLES_CONSTANTS.PERMISSION_LEVEL.ADMIN) {
      permissions.push('View', 'Edit', 'Delete');
    }
    result[scope] = permissions;
  });
  return result;
};
