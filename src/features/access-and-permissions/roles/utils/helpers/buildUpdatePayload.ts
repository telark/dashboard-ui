import type { RoleFormData } from '../../models';
import type { ChangeDetectionResult } from './changeDetection';

export const buildUpdatePayload = (
  fullRoleData: RoleFormData,
  currentProtection: Record<string, boolean>,
  changes: ChangeDetectionResult,
): Partial<RoleFormData> => {
  // status is not editable in this panel, so it is never sent: resending
  // the loaded copy would revert changes made elsewhere.
  const roleData: Partial<RoleFormData> = {};

  // The exporter refuses every key but protection while preventModification stays on.
  if (changes.modificationLocked) {
    if (changes.protectionHasChanged) roleData.protection = fullRoleData.protection;
    return roleData;
  }

  if (!currentProtection.lockName && changes.nameHasChanged) {
    roleData.name = fullRoleData.name;
  }
  if (changes.descriptionHasChanged) {
    roleData.description = fullRoleData.description;
  }
  if (!currentProtection.lockCategory && changes.categoryHasChanged) {
    roleData.categoryRef = fullRoleData.categoryRef;
  }
  if (!currentProtection.preventScopeChanges && changes.scopesHaveChanged) {
    roleData.scopesAndPermissions = fullRoleData.scopesAndPermissions;
  }
  if (changes.validityHasChanged) {
    roleData.validity = fullRoleData.validity;
  }
  if (changes.protectionHasChanged) {
    roleData.protection = fullRoleData.protection;
  }

  return roleData;
};

export const buildFieldsUpdatePayload = (
  fullRoleData: RoleFormData,
  changes: ChangeDetectionResult,
): Partial<RoleFormData> => {
  const fieldsData: Partial<RoleFormData> = {};

  if (changes.nameHasChanged) {
    fieldsData.name = fullRoleData.name;
  }
  if (changes.descriptionHasChanged) {
    fieldsData.description = fullRoleData.description;
  }
  if (changes.categoryHasChanged) {
    fieldsData.categoryRef = fullRoleData.categoryRef;
  }
  if (changes.scopesHaveChanged) {
    fieldsData.scopesAndPermissions = fullRoleData.scopesAndPermissions;
  }
  if (changes.validityHasChanged) {
    fieldsData.validity = fullRoleData.validity;
  }

  return fieldsData;
};
