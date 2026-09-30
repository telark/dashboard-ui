export type PermissionLevel = 'ReadOnly' | 'Contributor' | 'Owner' | 'Admin';

export type RoleStatus = 'Active' | 'Inactive' | 'Deprecated' | 'Deleted';

export interface RoleSource {
  kind: 'direct' | 'inherited';
  groupID?: string;
  groupName?: string;
}

export interface ResolvedScope {
  scope: string;
  level: PermissionLevel;
  rules?: string[];
}

export interface ResolvedRole {
  roleID: string;
  roleName: string;
  status: RoleStatus;
  priority: number;
  isExpired: boolean;
  sources: RoleSource[];
  scopes: ResolvedScope[];
}

export interface PermissionsResponse {
  userID: string;
  roles: ResolvedRole[];
}

export interface PermissionsState {
  userID: string | null;
  roles: ResolvedRole[];
  /** Highest effective permission level per scope after merging all roles by priority */
  scopeIndex: Record<string, { level: PermissionLevel; rules: string[] }>;
  loading: boolean;
  error: string | null;
  /** True after first successful fetch resolves; never flips back on subsequent fetches */
  ready: boolean;
}

export const PERMISSION_LEVEL_RANK: Record<PermissionLevel, number> = {
  ReadOnly: 1,
  Contributor: 2,
  Owner: 3,
  Admin: 4,
};
