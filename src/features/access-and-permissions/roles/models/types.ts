import type { Role } from './roles';
import { SCOPE_PERMISSIONS } from '../constants/roles';

export type RoleScopePermission = (typeof SCOPE_PERMISSIONS)[number];
export type RoleStatus = 'Active' | 'Inactive';
export type RoleType = 'built-in' | 'custom';
export type RoleFormData = Omit<Role, 'id' | 'creationDate' | 'lastUpdateDate'>;
export type RolesSortKey = 'name' | 'type' | 'permission' | 'creationDate' | 'status';

