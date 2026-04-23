import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectPermissionsState } from '../../store/selectors/permissionsSelectors';
import type { PermissionLevel } from '../../models/permissions';
import { PERMISSION_LEVEL_RANK } from '../../models/permissions';

// Minimum level per action derived from scopeRules.ts: lowest level at which the action rule first appears.
// roles.delete requires Owner because "deleterole" is absent from the Contributor rule set.
export const ACTION_PERMISSIONS = {
  users: {
    create: { scope: 'users' as const, level: 'Contributor' as PermissionLevel },
    edit: { scope: 'users' as const, level: 'Contributor' as PermissionLevel },
    delete: { scope: 'users' as const, level: 'Contributor' as PermissionLevel },
  },
  groups: {
    create: { scope: 'groups' as const, level: 'Contributor' as PermissionLevel },
    edit: { scope: 'groups' as const, level: 'Contributor' as PermissionLevel },
    delete: { scope: 'groups' as const, level: 'Contributor' as PermissionLevel },
  },
  roles: {
    create: { scope: 'roles' as const, level: 'Contributor' as PermissionLevel },
    edit: { scope: 'roles' as const, level: 'Contributor' as PermissionLevel },
    delete: { scope: 'roles' as const, level: 'Owner' as PermissionLevel },
  },
} as const;

function resolveEntry(
  scopeIndex: Record<string, { level: PermissionLevel; rules: string[] }>,
  scope: string,
): { level: PermissionLevel; rules: string[] } | undefined {
  return scopeIndex[scope] ?? scopeIndex['ALL'];
}

export function usePermission(requiredScope: string, requiredLevel: PermissionLevel): boolean {
  const { loading, roles, scopeIndex } = useSelector(selectPermissionsState);
  return useMemo(() => {
    if (loading || roles.length === 0) return false;
    const entry = resolveEntry(scopeIndex, requiredScope);
    if (!entry) return false;
    return PERMISSION_LEVEL_RANK[entry.level] >= PERMISSION_LEVEL_RANK[requiredLevel];
  }, [loading, roles.length, scopeIndex, requiredScope, requiredLevel]);
}

export function useCanAccess(
  checks: ReadonlyArray<{ scope: string; level: PermissionLevel }>,
): boolean {
  const { loading, roles, scopeIndex } = useSelector(selectPermissionsState);
  if (loading || roles.length === 0) return false;
  return checks.some(({ scope, level }) => {
    const entry = resolveEntry(scopeIndex, scope);
    if (!entry) return false;
    return PERMISSION_LEVEL_RANK[entry.level] >= PERMISSION_LEVEL_RANK[level];
  });
}

interface PermissionGateProps {
  requiredScope: string;
  requiredLevel: PermissionLevel;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  requiredScope,
  requiredLevel,
  children,
}) => {
  const allowed = usePermission(requiredScope, requiredLevel);
  if (!allowed) return null;
  return <>{children}</>;
};
