import type { Role, RoleFormData, RoleFormValues } from '../../models';
import { convertScopesToAPI, convertScopesFromAPI } from './scopes';
import { convertAssignedToToAPI, convertAssignedToFromAPI } from './assignment';
import dayjs from 'dayjs';

export const convertFormValuesToRoleFormData = (
  formValues: RoleFormValues,
  defaultType: string = 'custom',
  defaultStatus: string = 'Active',
): RoleFormData => {
  const assignedTo = convertAssignedToToAPI(formValues.assignedTo);

  // Convert expiresAt from dayjs to ISO string if present
  // Remove expirationModel as it's only a UI helper
  const validity = formValues.validity
    ? {
        type: formValues.validity.type,
        expiresAt: formValues.validity.expiresAt
          ? dayjs.isDayjs(formValues.validity.expiresAt)
            ? formValues.validity.expiresAt.toISOString()
            : formValues.validity.expiresAt
          : undefined,
        durationHours: formValues.validity.durationHours,
        autoRevoke: formValues.validity.autoRevoke,
      }
    : undefined;

  // Ensure protection is always an object (not undefined)
  const protection = formValues.protection || {
    preventDeletion: false,
    preventModification: false,
    preventScopeChanges: false,
    lockName: false,
    lockCategory: false,
    softDelete: false,
  };

  return {
    name: formValues.name,
    description: formValues.description || '',
    type: (formValues.type as 'built-in' | 'custom') || defaultType,
    categoryID: formValues.categoryID || '',
    status: (formValues.status as 'Active' | 'Inactive') || defaultStatus,
    scopesAndPermissions: convertScopesToAPI(formValues.scopes),
    validity: validity || {
      type: 'permanent',
      autoRevoke: true,
    },
    protection,
    assignedTo: { groupIDs: assignedTo.groupIDs, userIDs: assignedTo.userIDs },
  };
};

export const convertRoleToFormValues = (role: Role | null): RoleFormValues => {
  if (!role) {
    return {
      name: '',
      description: '',
      categoryID: '',
      type: 'custom',
      status: 'Active',
      scopes: {},
      validity: {
        type: 'permanent',
        autoRevoke: true,
      },
      protection: {
        preventDeletion: false,
        preventModification: false,
        preventScopeChanges: false,
        lockName: false,
        lockCategory: false,
        softDelete: false,
      },
      assignedTo: [],
    };
  }

  // Convert expiresAt from ISO string to dayjs if present
  // Set expirationModel based on which field is present (for UI state)
  const validity = role.validity
    ? {
        ...role.validity,
        expiresAt: role.validity.expiresAt ? dayjs(role.validity.expiresAt) : undefined,
        expirationModel: role.validity.expiresAt
          ? ('expiresAt' as const)
          : role.validity.durationHours
            ? ('durationHours' as const)
            : undefined,
      }
    : undefined;

  return {
    name: role.name,
    description: role.description || '',
    categoryID: role.categoryID || '',
    type: role.type,
    status: role.status,
    scopes: convertScopesFromAPI(role.scopesAndPermissions || []),
    validity: validity || {
      type: 'permanent',
      autoRevoke: true,
    },
    protection: role.protection || {
      preventDeletion: false,
      preventModification: false,
      preventScopeChanges: false,
      lockName: false,
      lockCategory: false,
      softDelete: false,
    },
    assignedTo: convertAssignedToFromAPI(role.assignedTo),
  };
};
