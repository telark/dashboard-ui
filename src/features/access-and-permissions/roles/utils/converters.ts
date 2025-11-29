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
 * Convert assignedTo array from form (["group-{id}", "user-{id}"]) to API format
 */
export const convertAssignedToToAPI = (
  assignedTo?: string[],
): { groupIDs: string[]; userIDs: string[] } | undefined => {
  if (!assignedTo || assignedTo.length === 0) {
    return undefined;
  }

  const groupIDs: string[] = [];
  const userIDs: string[] = [];

  assignedTo.forEach((item) => {
    if (item.startsWith('group-')) {
      groupIDs.push(item.replace('group-', ''));
    } else if (item.startsWith('user-')) {
      userIDs.push(item.replace('user-', ''));
    }
  });

  if (groupIDs.length === 0 && userIDs.length === 0) {
    return undefined;
  }

  const result: { groupIDs?: string[]; userIDs?: string[] } = {};
  if (groupIDs.length > 0) {
    result.groupIDs = groupIDs;
  }
  if (userIDs.length > 0) {
    result.userIDs = userIDs;
  }

  return result as { groupIDs: string[]; userIDs: string[] };
};

/**
 * Convert assignedTo from API format to form array format
 */
export const convertAssignedToFromAPI = (assignedTo?: {
  groupIDs?: string[];
  userIDs?: string[];
}): string[] => {
  if (!assignedTo) {
    return [];
  }

  const result: string[] = [];
  if (assignedTo.groupIDs) {
    result.push(...assignedTo.groupIDs.map((id) => `group-${id}`));
  }
  if (assignedTo.userIDs) {
    result.push(...assignedTo.userIDs.map((id) => `user-${id}`));
  }
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
    assignedTo?: string[];
  },
  defaultType: string = 'custom',
  defaultStatus: string = 'Active',
): RoleFormData => {
  const assignedTo = convertAssignedToToAPI(formValues.assignedTo);
  return {
    name: formValues.name,
    type: (formValues.type as 'built-in' | 'custom') || defaultType,
    status: (formValues.status as 'Active' | 'Inactive') || defaultStatus,
    scopesAndPermissions: convertScopesToAPI(formValues.scopes),
    assignedTo: assignedTo
      ? { groupIDs: assignedTo.groupIDs, userIDs: assignedTo.userIDs }
      : undefined,
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
  assignedTo?: string[];
} => {
  if (!role) {
    return {
      name: '',
      type: 'custom',
      status: 'Active',
      scopes: {},
      assignedTo: [],
    };
  }

  return {
    name: role.name,
    type: role.type,
    status: role.status,
    scopes: convertScopesFromAPI(role.scopesAndPermissions || []),
    assignedTo: convertAssignedToFromAPI(role.assignedTo),
  };
};
