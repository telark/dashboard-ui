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

export const isRoleProtected = (role: Role): boolean => {
  return role.protection?.preventDeletion === true && role.protection?.preventModification === true;
};
