import type { Role } from '../../models';

export const canModifyRole = (role: Role): boolean => {
  if (!role.protection) {
    return true;
  }
  return !role.protection.preventModification;
};

export const canDeleteRole = (role: Role): boolean => {
  if (!role.protection) {
    return true;
  }
  return !role.protection.preventDeletion;
};

export const canChangeScopes = (role: Role): boolean => {
  if (!role.protection) {
    return true;
  }
  return !role.protection.preventScopeChanges;
};

export const canModifyRoles = (roles: Role[]): boolean => {
  if (roles.length === 0) {
    return false;
  }
  return roles.every(canModifyRole);
};

export const canDeleteRoles = (roles: Role[]): boolean => {
  if (roles.length === 0) {
    return false;
  }
  return roles.every(canDeleteRole);
};

export const isRoleProtected = (role: Role): boolean => {
  return role.protection?.preventDeletion === true && role.protection?.preventModification === true;
};
