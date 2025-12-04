import type { Role, RoleFormData, RoleFormValues, ValidityType } from '../../models';
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
  // Only include temporary-specific fields (autoRevoke, expiresAt, durationHours) for temporary roles
  const validity = formValues.validity
    ? (() => {
        const baseValidity: { type: ValidityType; expiresAt?: string; durationHours?: number; autoRevoke?: boolean } = {
          type: formValues.validity.type as ValidityType,
        };
        
        if (formValues.validity.type === 'temporary') {
          if (formValues.validity.expiresAt) {
            baseValidity.expiresAt = dayjs.isDayjs(formValues.validity.expiresAt)
              ? formValues.validity.expiresAt.toISOString()
              : formValues.validity.expiresAt;
          }
          if (formValues.validity.durationHours !== undefined) {
            baseValidity.durationHours = formValues.validity.durationHours;
          }
          if (formValues.validity.autoRevoke !== undefined) {
            baseValidity.autoRevoke = formValues.validity.autoRevoke;
          }
        }
        
        return baseValidity;
      })()
    : undefined;

  // Ensure protection is always an object with actual values from form
  // Use explicit boolean conversion to handle undefined/null values
  const protection = {
    preventDeletion: Boolean(formValues.protection?.preventDeletion),
    preventModification: Boolean(formValues.protection?.preventModification),
    preventScopeChanges: Boolean(formValues.protection?.preventScopeChanges),
    lockName: Boolean(formValues.protection?.lockName),
    lockCategory: Boolean(formValues.protection?.lockCategory),
    softDelete: Boolean(formValues.protection?.softDelete),
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
