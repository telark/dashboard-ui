import type { RoleStatus, RoleType, PermissionLevel, ValidityType } from './types';

export interface ScopeAndPermissions {
  scope: string;
  level: PermissionLevel;
  rules?: string[];
}

export interface AssignedTo {
  groupIDs?: string[];
  userIDs?: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  version: string;
  type: RoleType;
  priority: number;
  categoryID: string;
  scopesAndPermissions: ScopeAndPermissions[];
  protection?: {
    preventDeletion?: boolean;
    preventModification?: boolean;
    preventScopeChanges?: boolean;
    lockName?: boolean;
    lockCategory?: boolean;
    softDelete?: boolean;
  };
  status: RoleStatus;
  validity?: {
    type: ValidityType;
    expiresAt?: string;
    durationHours?: number;
    autoRevoke?: boolean;
  };
  assignedTo?: AssignedTo;
  creationDate: string;
  lastUpdateDate?: string;
  createdBy?: string;
  lastUpdatedBy?: string;
  deprecatedAt?: string;
  deletedAt?: string;
}

export interface RolesTableProps {
  roles: Role[];
  onView?: (role: Role) => void;
  onEdit?: (role: Role) => void;
  loading?: boolean;
}

export interface RolesScopesAndPermissionsListProps {
  areas: ReadonlyArray<{ key: string; label: string }>;
  permissionLevels: ReadonlyArray<{ value: PermissionLevel; label: string }>;
  tooltipMap: Record<PermissionLevel, string>;
  rowPaddingPx?: number;
  dividerMarginPx?: number;
  isLocked?: boolean;
  onManualChange?: () => void;
}

export interface RolesState {
  roles: Role[];
  details: Role | null;
  loading: boolean;
  error: string | null;
}
