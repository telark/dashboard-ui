import type { PermissionLevel } from '../models/types';
import { PERMISSION_LEVEL_RANK } from '../../../auth/models/permissions';

export interface ScopeRule {
  key: string;
  label: string;
}

export interface ScopeRulesConfig {
  scope: string;
  rules: {
    [K in PermissionLevel]: ScopeRule[];
  };
}

export const SCOPE_RULES: ScopeRulesConfig[] = [
  {
    scope: 'applications',
    rules: {
      ReadOnly: [
        { key: 'viewapplicationsrollbacks', label: 'View Rollbacks' },
        { key: 'viewapplicationssnapshots', label: 'View Snapshots' },
        { key: 'viewapplicationsnapshotmanifest', label: 'View Snapshot Manifest' },
      ],
      Contributor: [
        { key: 'editapplication', label: 'Edit Application' },
        { key: 'forceapplicationsync', label: 'Force Sync' },
        { key: 'rollbackapplication', label: 'Rollback Application' },
      ],
      Owner: [{ key: 'deleteapplication', label: 'Delete Application' }],
      Admin: [],
    },
  },
  {
    scope: 'groups',
    rules: {
      ReadOnly: [
        { key: 'viewgroupscategories', label: 'View Categories' },
        { key: 'viewgroupattachedroles', label: 'View Attached Roles' },
      ],
      Contributor: [
        { key: 'creategroup', label: 'Create Group' },
        { key: 'editgroup', label: 'Edit Group' },
        { key: 'addgroupcategory', label: 'Add Category' },
      ],
      Owner: [
        { key: 'addusertogroup', label: 'Add Member' },
        { key: 'removeuserfromgroup', label: 'Remove Member' },
        { key: 'deletegroup', label: 'Delete Group' },
        { key: 'attachroletogroup', label: 'Attach Role' },
        { key: 'removerolefromgroup', label: 'Remove Role' },
        { key: 'editgroupcategory', label: 'Edit Category' },
        { key: 'deletegroupcategory', label: 'Delete Category' },
      ],
      Admin: [],
    },
  },
  {
    scope: 'users',
    rules: {
      ReadOnly: [{ key: 'viewuserattachedroles', label: 'View Attached Roles' }],
      Contributor: [{ key: 'createuser', label: 'Create User' }],
      Owner: [
        { key: 'deleteuser', label: 'Delete User' },
        { key: 'attachroletouser', label: 'Attach Role' },
        { key: 'removerolefromuser', label: 'Remove Role' },
      ],
      Admin: [{ key: 'suspenduser', label: 'Suspend User' }],
    },
  },
  {
    scope: 'roles',
    rules: {
      ReadOnly: [{ key: 'viewrolescategories', label: 'View Categories' }],
      Contributor: [
        { key: 'createrole', label: 'Create Role' },
        { key: 'editrole', label: 'Edit Role' },
        { key: 'addrolecategory', label: 'Add Category' },
      ],
      Owner: [
        { key: 'deleterole', label: 'Delete Role' },
        { key: 'editrolecategory', label: 'Edit Category' },
        { key: 'deleterolecategory', label: 'Delete Category' },
      ],
      Admin: [],
    },
  },
  {
    scope: 'settings',
    rules: {
      ReadOnly: [],
      Contributor: [
        { key: 'editdiscoveryconfig', label: 'Edit Discovery Config' },
        { key: 'editsnapshotstorage', label: 'Edit Snapshot Storage' },
      ],
      Owner: [{ key: 'controlainsights', label: 'Control AI Insights' }],
      Admin: [{ key: 'editoidcconfig', label: 'Edit OIDC Config' }],
    },
  },
  {
    scope: 'protection-plans',
    rules: {
      ReadOnly: [{ key: 'viewprotectionplanviolations', label: 'View Violations' }],
      Contributor: [
        { key: 'createprotectionplan', label: 'Create Protection Plan' },
        { key: 'editprotectionplan', label: 'Edit Protection Plan' },
        { key: 'cancelprotectionplan', label: 'Cancel Protection Plan' },
        { key: 'duplicateprotectionplan', label: 'Duplicate Protection Plan' },
        { key: 'reactivateprotectionplan', label: 'Reactivate Protection Plan' },
      ],
      Owner: [{ key: 'deleteprotectionplan', label: 'Delete Protection Plan' }],
      Admin: [],
    },
  },
];

const ORDERED_LEVELS: PermissionLevel[] = ['ReadOnly', 'Contributor', 'Owner', 'Admin'];

export const getScopeRules = (scope: string, level: PermissionLevel): ScopeRule[] => {
  const scopeConfig = SCOPE_RULES.find((config) => config.scope === scope.toLowerCase());
  if (!scopeConfig) return [];

  const requestedRank = PERMISSION_LEVEL_RANK[level];
  const seen = new Set<string>();
  const merged: ScopeRule[] = [];

  for (const l of ORDERED_LEVELS) {
    if (PERMISSION_LEVEL_RANK[l] > requestedRank) break;
    for (const rule of scopeConfig.rules[l] ?? []) {
      if (!seen.has(rule.key)) {
        seen.add(rule.key);
        merged.push(rule);
      }
    }
  }

  return merged;
};

export const formatRuleKey = (scope: string, ruleKey: string): string => {
  return `${scope.toLowerCase()}.${ruleKey.toLowerCase()}.deny`;
};

export const parseRuleKey = (formattedKey: string): { scope: string; ruleKey: string } | null => {
  const parts = formattedKey.split('.');
  if (parts.length < 2) return null;
  // Handle both old format (scope.rule) and new format (scope.rule.deny)
  if (parts.length === 3 && parts[2] === 'deny') {
    return { scope: parts[0], ruleKey: parts[1] };
  }
  if (parts.length === 2) {
    return { scope: parts[0], ruleKey: parts[1] };
  }
  return null;
};
