import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectPermissionsState } from '../../store/selectors/permissionsSelectors';
import type { PermissionLevel } from '../../models/permissions';
import { PERMISSION_LEVEL_RANK } from '../../models/permissions';

// Minimum level per action derived from scopeRules.ts: lowest level at which the action rule first appears.
// roles.delete requires Owner because "deleterole" is absent from the Contributor rule set.
// deny: the formatRuleKey(scope, actionKey) string; if present in the scope entry's rules array, access is denied.
export const ACTION_PERMISSIONS = {
  users: {
    create: {
      scope: 'users' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'users.createuser.deny',
    },
    edit: {
      scope: 'users' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'users.edituser.deny',
    },
    delete: {
      scope: 'users' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'users.deleteuser.deny',
    },
    manageRoles: {
      scope: 'users' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'users.attachroletouser.deny',
    },
    manageGroups: {
      scope: 'users' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'users.addusertogroup.deny',
    },
    viewCategories: {
      scope: 'users' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'users.viewuserscategories.deny',
    },
    addCategory: {
      scope: 'users' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'users.addusercategory.deny',
    },
  },
  groups: {
    create: {
      scope: 'groups' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'groups.creategroup.deny',
    },
    edit: {
      scope: 'groups' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'groups.editgroup.deny',
    },
    delete: {
      scope: 'groups' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'groups.deletegroup.deny',
    },
    attachRole: {
      scope: 'groups' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'groups.attachroletogroup.deny',
    },
    attachMember: {
      scope: 'groups' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'groups.addusertogroup.deny',
    },
    viewCategories: {
      scope: 'groups' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'groups.viewgroupscategories.deny',
    },
    addCategory: {
      scope: 'groups' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'groups.addgroupcategory.deny',
    },
  },
  roles: {
    create: {
      scope: 'roles' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'roles.createrole.deny',
    },
    edit: {
      scope: 'roles' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'roles.editrole.deny',
    },
    delete: {
      scope: 'roles' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'roles.deleterole.deny',
    },
    viewCategories: {
      scope: 'roles' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'roles.viewrolescategories.deny',
    },
    addCategory: {
      scope: 'roles' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'roles.addrolecategory.deny',
    },
  },
} as const;

function resolveEntry(
  scopeIndex: Record<string, { level: PermissionLevel; rules: string[] }>,
  scope: string,
): { level: PermissionLevel; rules: string[] } | undefined {
  return scopeIndex[scope] ?? scopeIndex['ALL'];
}

export function usePermission(
  requiredScope: string,
  requiredLevel: PermissionLevel,
  action?: string,
): boolean {
  const { loading, roles, scopeIndex } = useSelector(selectPermissionsState);
  return useMemo(() => {
    if (loading || roles.length === 0) return false;
    const entry = resolveEntry(scopeIndex, requiredScope);
    if (!entry) return false;
    if (PERMISSION_LEVEL_RANK[entry.level] < PERMISSION_LEVEL_RANK[requiredLevel]) return false;
    if (action && entry.rules.includes(action)) return false;
    return true;
  }, [loading, roles.length, scopeIndex, requiredScope, requiredLevel, action]);
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
