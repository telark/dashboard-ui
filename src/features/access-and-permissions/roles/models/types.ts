import type { Role } from './roles';

export type RoleStatus = 'Active' | 'Inactive';
export type RoleType = 'built-in' | 'custom';
export type PermissionLevel = 'ReadOnly' | 'Contributor' | 'Owner' | 'Admin';
export type ValidityType = 'permanent' | 'temporary' | 'sessionBased';
export type RoleFormData = Omit<
  Role,
  'id' | 'creationDate' | 'lastUpdateDate' | 'version' | 'priority' | 'deprecatedAt' | 'deletedAt'
>;
export type RolesSortKey = 'name' | 'type' | 'creationDate' | 'status';
