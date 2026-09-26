import type { Role, RoleFormData, RoleFormValues, RoleType, RoleStatus } from '../../models';
import { convertScopesToAPI, convertScopesFromAPI } from './scopes';
import { buildValidityForAPI, buildValidityForForm } from '../validity/builders';
import { ROLES_CONSTANTS as RC } from '../../constants';

const DEFAULT_PROTECTION = {
  preventDeletion: false,
  preventModification: false,
  preventScopeChanges: false,
  lockName: false,
  lockCategory: false,
  softDelete: false,
} as const;

export const convertFormValuesToRoleFormData = (
  formValues: RoleFormValues,
  defaultType: RoleType = RC.VALUES.ROLE_TYPE_CUSTOM as RoleType,
  defaultStatus: RoleStatus = RC.STATUS.ACTIVE as RoleStatus,
): RoleFormData => {
  return {
    name: formValues.name,
    description: formValues.description || '',
    type: (formValues.type as RoleType) || defaultType,
    categoryRef: formValues.categoryRef || '',
    status: (formValues.status as RoleStatus) || defaultStatus,
    scopesAndPermissions: convertScopesToAPI(formValues.scopes),
    validity: buildValidityForAPI(formValues.validity),
    protection: {
      preventDeletion: Boolean(formValues.protection?.preventDeletion),
      preventModification: Boolean(formValues.protection?.preventModification),
      preventScopeChanges: Boolean(formValues.protection?.preventScopeChanges),
      lockName: Boolean(formValues.protection?.lockName),
      lockCategory: Boolean(formValues.protection?.lockCategory),
      softDelete: Boolean(formValues.protection?.softDelete),
    },
  };
};

export const convertRoleToFormValues = (role: Role | null): RoleFormValues => {
  if (!role) {
    return {
      name: '',
      description: '',
      categoryRef: '',
      type: RC.VALUES.ROLE_TYPE_CUSTOM,
      status: RC.STATUS.ACTIVE,
      scopes: {},
      validity: { type: RC.VALIDITY_TYPES.PERMANENT },
      protection: DEFAULT_PROTECTION,
    };
  }

  return {
    name: role.name,
    description: role.description || '',
    categoryRef: role.categoryRef || '',
    type: role.type,
    status: role.status,
    scopes: convertScopesFromAPI(role.scopesAndPermissions || []),
    validity: buildValidityForForm(role.validity),
    protection: role.protection || DEFAULT_PROTECTION,
  };
};
