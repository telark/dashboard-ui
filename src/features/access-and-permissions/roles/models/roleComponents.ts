import type { Role } from './roles';

export interface RolesGeneralSectionProps {
  roles: Role[];
  isEditMode?: boolean;
  currentName?: string;
}

export interface ActionsProps {
  record: Role;
  onView: (r: Role) => void;
  onEdit?: (r: Role) => void;
  onDelete: (r: Role) => void;
}

export interface ScopesPermissionsProps {
  scopes: Record<string, string[]>;
}

export type RolesSortKey = 'name' | 'type' | 'permission' | 'creationDate' | 'status';

export interface ColumnsArgs {
  onView: (r: Role) => void;
  onEdit?: (r: Role) => void;
  onDelete: (r: Role) => void;
  onSort: (key: RolesSortKey) => void;
  activeSortKey: RolesSortKey;
  sortOrder: 'asc' | 'desc';
  getPermissionCount: (r: Role) => number;
}

