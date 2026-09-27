import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectPermissionsState } from '../../store/selectors/permissionsSelectors';
import type { PermissionLevel } from '../../models/permissions';
import { PERMISSION_LEVEL_RANK } from '../../models/permissions';
import { ALL_SCOPE_NAME, ALL_SCOPE_NAMES } from '../../store/slices/permissionsSlice';

// Minimum level per action derived from scopeRules.ts: lowest level at which the action rule first appears.
export const ACTION_PERMISSIONS = {
  applications: {
    view: { scope: 'applications' as const, level: 'ReadOnly' as PermissionLevel },
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
  insights: {
    view: { scope: 'insights' as const, level: 'ReadOnly' as PermissionLevel },
    triage: {
      scope: 'insights' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'insights.triageinsights.deny',
    },
    analyze: {
      scope: 'insights' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'insights.analyzeinsights.deny',
    },
    // Bulk actions are triage too, so the triage deny rule blocks them as well.
    bulk: {
      scope: 'insights' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'insights.triageinsights.deny',
    },
  },
  users: {
    view: { scope: 'users' as const, level: 'ReadOnly' as PermissionLevel },
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
  },
  groups: {
    view: { scope: 'groups' as const, level: 'ReadOnly' as PermissionLevel },
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
  },
  roles: {
    view: { scope: 'roles' as const, level: 'ReadOnly' as PermissionLevel },
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
    viewGovernance: { scope: 'settings' as const, level: 'Contributor' as PermissionLevel },
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
    editOidcConfig: {
      scope: 'settings' as const,
      level: 'Admin' as PermissionLevel,
      deny: 'settings.editoidcconfig.deny',
    },
  },
  protectionPlans: {
    viewViolations: {
      scope: 'protection-plans' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'protection-plans.viewprotectionplanviolations.deny',
    },
    create: {
      scope: 'protection-plans' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'protection-plans.createprotectionplan.deny',
    },
    edit: {
      scope: 'protection-plans' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'protection-plans.editprotectionplan.deny',
    },
    cancel: {
      scope: 'protection-plans' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'protection-plans.cancelprotectionplan.deny',
    },
    duplicate: {
      scope: 'protection-plans' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'protection-plans.duplicateprotectionplan.deny',
    },
    reactivate: {
      scope: 'protection-plans' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'protection-plans.reactivateprotectionplan.deny',
    },
    delete: {
      scope: 'protection-plans' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'protection-plans.deleteprotectionplan.deny',
    },
    approve: {
      scope: 'protection-plans' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'protection-plans.approveprotectionplan.deny',
    },
    view: {
      scope: 'protection-plans' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'protection-plans.viewprotectionplans.deny',
    },
    viewReports: {
      scope: 'protection-plans' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'protection-plans.viewprotectionplanreports.deny',
    },
    downloadReport: {
      scope: 'protection-plans' as const,
      level: 'ReadOnly' as PermissionLevel,
      deny: 'protection-plans.downloadprotectionplanreport.deny',
    },
    generateReport: {
      scope: 'protection-plans' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'protection-plans.generateprotectionplanreport.deny',
    },
    reject: {
      scope: 'protection-plans' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'protection-plans.rejectprotectionplan.deny',
    },
    addCategory: {
      scope: 'protection-plans' as const,
      level: 'Contributor' as PermissionLevel,
      deny: 'protection-plans.addprotectionplancategory.deny',
    },
    editCategory: {
      scope: 'protection-plans' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'protection-plans.editprotectionplancategory.deny',
    },
    deleteCategory: {
      scope: 'protection-plans' as const,
      level: 'Owner' as PermissionLevel,
      deny: 'protection-plans.deleteprotectionplancategory.deny',
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

// Whether the viewer may hand out these scope grants: the backend refuses any grant above
// the caller's own level on that scope, and an ALL grant covers every scope. Deny rules don't count.
export function useCanGrantScopes(): (
  grants: ReadonlyArray<{ scope: string; level: PermissionLevel }>,
) => boolean {
  const { scopeIndex } = useSelector(selectPermissionsState);
  return useCallback(
    (grants) =>
      grants.every(({ scope, level }) =>
        (scope.toUpperCase() === ALL_SCOPE_NAME ? ALL_SCOPE_NAMES : [scope]).every((name) => {
          const entry = resolveEntry(scopeIndex, name);
          return !!entry && PERMISSION_LEVEL_RANK[entry.level] >= PERMISSION_LEVEL_RANK[level];
        }),
      ),
    [scopeIndex],
  );
}

interface PermissionGateProps {
  requiredScope: string;
  requiredLevel: PermissionLevel;
  action?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  requiredScope,
  requiredLevel,
  action,
  fallback = null,
  children,
}) => {
  const allowed = usePermission(requiredScope, requiredLevel, action);
  return <>{allowed ? children : fallback}</>;
};
