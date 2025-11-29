import type { RoleStatus, RoleType, RoleScopePermission } from './types';

export interface ScopeAndPermissions {
  scope: string;
  permissions: string[];
}

export interface AssignedTo {
  groupIDs?: string[];
  userIDs?: string[];
}

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  scopesAndPermissions: ScopeAndPermissions[];
  status: RoleStatus;
  creationDate: string;
  lastUpdateDate?: string;
  assignedTo?: AssignedTo;
}

export interface RolesTableProps {
  roles: Role[];
  onView?: (role: Role) => void;
  onEdit?: (role: Role) => void;
  loading?: boolean;
}

export interface RolesScopesAndPermissionsListProps {
  areas: ReadonlyArray<{ key: string; label: string }>;
  permissions: ReadonlyArray<RoleScopePermission>;
  tooltipMap: Record<RoleScopePermission, string>;
  rowPaddingPx?: number;
  dividerMarginPx?: number;
}

export interface RolesState {
  roles: Role[];
  details: Role | null;
  loading: boolean;
  error: string | null;
}
