import type { RoleFormData } from '../../models';
import type { ChangeDetectionResult } from './changeDetection';

export const buildUpdatePayload = (
  fullRoleData: RoleFormData,
  currentProtection: Record<string, boolean>,
  changes: ChangeDetectionResult,
): Partial<RoleFormData> => {
  const roleData: Partial<RoleFormData> = {};

  if (!currentProtection.lockName && changes.nameHasChanged) {
    roleData.name = fullRoleData.name;
  }
  if (fullRoleData.description !== undefined) {
    roleData.description = fullRoleData.description;
  }
  if (!currentProtection.lockCategory && changes.categoryHasChanged) {
    roleData.categoryID = fullRoleData.categoryID;
  }
  if (fullRoleData.type !== undefined) {
    roleData.type = fullRoleData.type;
  }
  if (fullRoleData.status !== undefined) {
    roleData.status = fullRoleData.status;
  }
  if (!currentProtection.preventScopeChanges && changes.scopesHaveChanged) {
    roleData.scopesAndPermissions = fullRoleData.scopesAndPermissions;
  }
  if (fullRoleData.validity !== undefined) {
    roleData.validity = fullRoleData.validity;
  }
  if (changes.protectionHasChanged) {
    roleData.protection = fullRoleData.protection;
  }
  if (fullRoleData.assignedTo !== undefined) {
    roleData.assignedTo = fullRoleData.assignedTo;
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
  if (fullRoleData.description !== undefined) {
    fieldsData.description = fullRoleData.description;
  }
  if (changes.categoryHasChanged) {
    fieldsData.categoryID = fullRoleData.categoryID;
  }
  if (fullRoleData.type !== undefined) {
    fieldsData.type = fullRoleData.type;
  }
  if (fullRoleData.status !== undefined) {
    fieldsData.status = fullRoleData.status;
  }
  if (changes.scopesHaveChanged) {
    fieldsData.scopesAndPermissions = fullRoleData.scopesAndPermissions;
  }
  if (fullRoleData.validity !== undefined) {
    fieldsData.validity = fullRoleData.validity;
  }
  if (fullRoleData.assignedTo !== undefined) {
    fieldsData.assignedTo = fullRoleData.assignedTo;
  }

  return fieldsData;
};

