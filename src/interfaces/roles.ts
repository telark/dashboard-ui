export const ROLE_SCOPE_LEVELS = ['View', 'Edit', 'Delete'] as const;
export type RoleScopeLevel = typeof ROLE_SCOPE_LEVELS[number];
export type RoleType = 'built-in' | 'custom';
export interface Role {
  id: string;
  name: string;
  group: string;
  scopes: Record<string, RoleScopeLevel[]>;
  status?: 'Active' | 'Inactive';
  createdAt?: string; // ISO date
  type?: RoleType;
}

export interface RolesHeaderProps {
  title?: string;
  subtitle?: string;
  onPrimary?: () => void;
  primaryText?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
}

export interface RolesTableProps {
  roles: Role[];
  onRolesChange?: (next: Role[]) => void;
  onView?: (role: Role) => void;
}

export interface RolesGeneralSectionProps {
  form: any; // AntD FormInstance
}

export interface RolesScopesAndPermissionsSectionProps {
  form: any; // AntD FormInstance
}

export interface RolesScopesAndPermissionsListProps {
  areas: ReadonlyArray<{ key: string; label: string }>;
  levels: ReadonlyArray<RoleScopeLevel>;
  tooltipMap: Record<RoleScopeLevel, string>;
  rowPaddingPx?: number;
  dividerMarginPx?: number;
}


