import type { RoleScopePermission, RoleStatus, RoleType } from '../../constants/pages/roles';
export type { RoleScopePermission } from '../../constants/pages/roles';

export interface Role {
  id: string;
  name: string;
  scopes: Record<string, RoleScopePermission[]>;
  status: RoleStatus;
  createdAt: string;
  type: RoleType;
}

export interface RolesTableProps {
  roles: Role[];
  onRolesChange?: (next: Role[]) => void;
  onView?: (role: Role) => void;
  onEdit?: (role: Role) => void;
}

export interface RolesScopesAndPermissionsListProps {
  areas: ReadonlyArray<{ key: string; label: string }>;
  permissions: ReadonlyArray<RoleScopePermission>;
  tooltipMap: Record<RoleScopePermission, string>;
  rowPaddingPx?: number;
  dividerMarginPx?: number;
}

