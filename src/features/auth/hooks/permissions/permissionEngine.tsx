import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectPermissionsState } from '../../store/selectors/permissionsSelectors';
import type { PermissionLevel } from '../../models/permissions';
import { PERMISSION_LEVEL_RANK } from '../../models/permissions';

// Minimum level per action derived from scopeRules.ts: lowest level at which the action rule first appears.
export const ACTION_PERMISSIONS = {
  applications: {
    viewRollbacks: {
      scope: 'applications' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'applications.viewapplicationsrollbacks.deny',
    },
    viewSnapshots: {
      scope: 'applications' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'applications.viewapplicationssnapshots.deny',
    },
    viewSnapshotManifest: {
      scope: 'applications' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'applications.viewapplicationsnapshotmanifest.deny',
    },
    edit: {
      scope: 'applications' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'applications.editapplication.deny',
    },
    forceSync: {
      scope: 'applications' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'applications.forceapplicationsync.deny',
    },
    delete: {
      scope: 'applications' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'applications.deleteapplication.deny',
    },
    rollback: {
      scope: 'applications' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'applications.rollbackapplication.deny',
    },
  },
  users: {
    create: {
      scope: 'users' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'users.createuser.deny',
    },
    suspend: {
      scope: 'users' as const,
      level: 'Admin' as PermissionLevel,
      deny: 'users.suspenduser.deny',
    },
    delete: {
      scope: 'users' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'users.deleteuser.deny',
    },
    manageRoles: {
      scope: 'users' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'users.attachroletouser.deny',
    },
    manageGroups: {
      scope: 'groups' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'groups.addusertogroup.deny',
    },
    removeRole: {
      scope: 'users' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'users.removerolefromuser.deny',
    },
    removeFromGroup: {
      scope: 'groups' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'groups.removeuserfromgroup.deny',
    },
    // todo: wire viewAttachedRoles to component when supported
    viewAttachedRoles: {
      scope: 'users' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'users.viewuserattachedroles.deny',
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
      level: 'Owner' as PermissionLevel,
      deny: 'groups.deletegroup.deny',
    },
    attachRole: {
      scope: 'groups' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'groups.attachroletogroup.deny',
    },
    attachMember: {
      scope: 'groups' as const,
      level: 'Owner' as PermissionLevel,
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
    editCategory: {
      scope: 'groups' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'groups.editgroupcategory.deny',
    },
    deleteCategory: {
      scope: 'groups' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'groups.deletegroupcategory.deny',
    },
    removeRole: {
      scope: 'groups' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'groups.removerolefromgroup.deny',
    },
    removeMember: {
      scope: 'groups' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'groups.removeuserfromgroup.deny',
    },
    // todo: wire viewAttachedRoles to component when supported
    viewAttachedRoles: {
      scope: 'groups' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'groups.viewgroupattachedroles.deny',
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
    editCategory: {
      scope: 'roles' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'roles.editrolecategory.deny',
    },
    deleteCategory: {
      scope: 'roles' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'roles.deleterolecategory.deny',
    },
  },
  settings: {
    editDiscoveryConfig: {
      scope: 'settings' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'settings.editdiscoveryconfig.deny',
    },
    editSnapshotStorage: {
      scope: 'settings' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'settings.editsnapshotstorage.deny',
    },
    controlAiInsights: {
      scope: 'settings' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'settings.controlainsights.deny',
    },
  },
} as const;

function resolveEntry(
  scopeIndex: Record<string, { level: PermissionLevel; rules: string[] }>,
  scope: string,
): { level: PermissionLevel; rules: string[] } | undefined {
  return scopeIndex[scope];
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
