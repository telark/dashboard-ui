import type { Role } from './roles';
import type { RolesSortKey } from './types';

export interface RolesGeneralSectionProps {
  roles: Role[];
  isEditMode?: boolean;
  currentName?: string;
  lockName?: boolean;
  lockCategory?: boolean;
}

export interface ActionsProps {
  record: Role;
  onView: (r: Role) => void;
  onEdit?: (r: Role) => void;
  onDelete: (r: Role) => void;
}

export interface ScopesPermissionsProps {
  scopes: Record<string, { level: string; rules?: string[] }>;
}

export interface ColumnsArgs {
  onView?: (r: Role) => void;
  onEdit?: (r: Role) => void;
  onDelete?: (r: Role) => void;
  onSort: (key: RolesSortKey) => void;
  activeSortKey: RolesSortKey;
  sortOrder?: 'asc' | 'desc';
  getPermissionCount: (r: Role) => number;
}
