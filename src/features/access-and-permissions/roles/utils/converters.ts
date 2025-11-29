import type { Role, ScopeAndPermissions, RoleFormData } from '../models';
import type { RoleScopePermission } from '../constants';

/**
 * Convert scopes from Record format (form) to array format (API)
 */
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

/**
 * Convert scopes from array format (API) to Record format (form)
 */
export const convertScopesFromAPI = (
  scopesAndPermissions: ScopeAndPermissions[],
): Record<string, RoleScopePermission[]> => {
  const result: Record<string, RoleScopePermission[]> = {};
  scopesAndPermissions.forEach(({ scope, permissions }) => {
    result[scope] = permissions as RoleScopePermission[];
  });
  return result;
};

/**
 * Convert RoleFormValues to RoleFormData for API
 */
export const convertFormValuesToRoleFormData = (
  formValues: {
    name: string;
    type?: string;
    status?: string;
    scopes: Record<string, RoleScopePermission[]>;
  },
  defaultType: string = 'custom',
  defaultStatus: string = 'Active',
): RoleFormData => {
  return {
    name: formValues.name,
    type: (formValues.type as 'built-in' | 'custom') || defaultType,
    status: (formValues.status as 'Active' | 'Inactive') || defaultStatus,
    scopesAndPermissions: convertScopesToAPI(formValues.scopes),
  };
};

/**
 * Convert Role to form values
 */
export const convertRoleToFormValues = (
  role: Role | null,
): {
  name: string;
  type: string;
  status: string;
  scopes: Record<string, RoleScopePermission[]>;
} => {
  if (!role) {
    return {
      name: '',
      type: 'custom',
      status: 'Active',
      scopes: {},
    };
  }

  return {
    name: role.name,
    type: role.type,
    status: role.status,
    scopes: convertScopesFromAPI(role.scopesAndPermissions || []),
  };
};
