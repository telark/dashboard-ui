import type { Role, RoleFormData, RoleFormValues } from '../../models';
import { convertScopesToAPI, convertScopesFromAPI } from './scopes';
import { convertAssignedToToAPI, convertAssignedToFromAPI } from './assignment';

export const convertFormValuesToRoleFormData = (
  formValues: RoleFormValues,
  defaultType: string = 'custom',
  defaultStatus: string = 'Active',
  description: string = '',
  categoryID: string = '',
): RoleFormData => {
  const assignedTo = convertAssignedToToAPI(formValues.assignedTo);
  return {
    name: formValues.name,
    description,
    type: (formValues.type as 'built-in' | 'custom') || defaultType,
    categoryID,
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
