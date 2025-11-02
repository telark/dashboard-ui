import type { RoleScopePermission, RoleStatus, RoleType } from '../constants/pages/roles';
import type { ReactNode } from 'react';
export type { RoleScopePermission };

export interface Role {
  id: string;
  name: string;
  group: string;
  scopes: Record<string, RoleScopePermission[]>;
  status: RoleStatus;
  createdAt: string;
  type: RoleType;
}

export interface RolesHeaderProps {
  title?: string;
  subtitle?: string;
  onPrimary?: () => void;
  primaryText?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
  primaryIcon?: ReactNode;
  secondaryText?: string;
  onSecondary?: () => void;
  secondaryIcon?: ReactNode;
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
  permissions: ReadonlyArray<RoleScopePermission>;
  tooltipMap: Record<RoleScopePermission, string>;
  rowPaddingPx?: number;
  dividerMarginPx?: number;
}

export interface RoleCategory {
  id: string;
  name: string;
  description: string;
  usedBy: string[]; // role names
  type: string;
  createdAt: string;
}

export interface RoleCategoriesTableProps {
  categories: RoleCategory[];
  onView?: (cat: RoleCategory) => void;
  onCategoriesChange?: (next: RoleCategory[]) => void;
}


