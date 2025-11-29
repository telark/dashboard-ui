import type { Role, RoleFormData } from '../../models';
import type { RoleScopePermission } from '../../constants';
import { convertScopesToAPI, convertScopesFromAPI } from './scopes';
import { convertAssignedToToAPI, convertAssignedToFromAPI } from './assignment';

export interface RoleFormValues {
  name: string;
  type?: string;
  status?: string;
  scopes: Record<string, RoleScopePermission[]>;
  assignedTo?: string[];
}

export const convertFormValuesToRoleFormData = (
  formValues: RoleFormValues,
  defaultType: string = 'custom',
  defaultStatus: string = 'Active',
): RoleFormData => {
  const assignedTo = convertAssignedToToAPI(formValues.assignedTo);
  return {
    name: formValues.name,
    type: (formValues.type as 'built-in' | 'custom') || defaultType,
    status: (formValues.status as 'Active' | 'Inactive') || defaultStatus,
    scopesAndPermissions: convertScopesToAPI(formValues.scopes),
    assignedTo: { groupIDs: assignedTo.groupIDs, userIDs: assignedTo.userIDs },
  };
};

export const convertRoleToFormValues = (role: Role | null): RoleFormValues => {
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
