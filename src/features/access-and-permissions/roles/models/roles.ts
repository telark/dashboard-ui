import type { RoleStatus, RoleType, PermissionLevel, ValidityType } from './types';

export interface ScopeAndPermissions {
  scope: string;
  level: PermissionLevel;
  rules?: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  version: string;
  type: RoleType;
  priority: number;
  categoryRef: string;
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
  creationDate: string;
  lastUpdateDate?: string;
  createdBy?: string;
  lastUpdatedBy?: string;
  deprecatedAt?: string;
  deletedAt?: string;
}

export interface RolesScopesAndPermissionsListProps {
  areas: ReadonlyArray<{ key: string; label: string }>;
  permissionLevels: ReadonlyArray<{ value: PermissionLevel; label: string }>;
  tooltipMap: Record<PermissionLevel, string>;
  rowPaddingPx?: number;
  dividerMarginPx?: number;
  isLocked?: boolean;
  onManualChange?: () => void;
  initialScopes?: Record<string, { level: string; rules?: string[] }>;
}

export interface RolesState {
  roles: Role[];
  details: Role | null;
  loading: boolean;
  error: string | null;
  deletingIds: string[];
}
