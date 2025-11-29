import type { ScopeAndPermissions } from '../../models';
import type { RoleScopePermission } from '../../constants';

export const convertScopesToAPI = (
  scopes: Record<string, RoleScopePermission[]>,
): ScopeAndPermissions[] => {
  return Object.entries(scopes)
    .filter(([, permissions]) => permissions && permissions.length > 0)
    .map(([scope, permissions]) => ({
      scope,
      permissions: permissions as string[],
    }));
};

export const convertScopesFromAPI = (
  scopesAndPermissions: ScopeAndPermissions[],
): Record<string, RoleScopePermission[]> => {
  const result: Record<string, RoleScopePermission[]> = {};
  scopesAndPermissions.forEach(({ scope, permissions }) => {
    result[scope] = permissions as RoleScopePermission[];
  });
  return result;
};
