import type { PermissionLevel } from '../models/types';
import { PERMISSION_LEVEL_RANK } from '../../../auth/models/permissions';

export interface ScopeRule {
  key: string;
  label: string;
  // Shown where a role denies the rule: "Can't roll back applications".
  denied: string;
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
        {
          key: 'viewapplicationsrollbacks',
          label: 'View Rollbacks',
          denied: "Can't view rollbacks",
        },
        {
          key: 'viewapplicationssnapshots',
          label: 'View Snapshots',
          denied: "Can't view snapshots",
        },
        {
          key: 'viewapplicationsnapshotmanifest',
          label: 'View Snapshot Manifest',
          denied: "Can't view snapshot manifests",
        },
      ],
      Contributor: [
        { key: 'editapplication', label: 'Edit Application', denied: "Can't edit applications" },
        {
          key: 'forceapplicationsync',
          label: 'Force Sync',
          denied: "Can't force-sync applications",
        },
        {
          key: 'rollbackapplication',
          label: 'Rollback Application',
          denied: "Can't roll back applications",
        },
      ],
      Owner: [
        {
          key: 'deleteapplication',
          label: 'Delete Application',
          denied: "Can't delete applications",
        },
      ],
      Admin: [],
    },
  },
  {
    scope: 'insights',
    rules: {
      ReadOnly: [],
      Contributor: [
        {
          key: 'analyzeinsights',
          label: 'Analyze Application',
          denied: "Can't analyze applications",
        },
        {
          key: 'triageinsights',
          label: 'Acknowledge, Dismiss and Reopen',
          denied: "Can't acknowledge, dismiss or reopen insights",
        },
      ],
      Owner: [],
      Admin: [],
    },
  },
  {
    scope: 'groups',
    rules: {
      ReadOnly: [
        {
          key: 'viewgroupscategories',
          label: 'View Categories',
          denied: "Can't view group categories",
        },
      ],
      Contributor: [
        { key: 'creategroup', label: 'Create Group', denied: "Can't create groups" },
        { key: 'editgroup', label: 'Edit Group', denied: "Can't edit groups" },
        { key: 'addgroupcategory', label: 'Add Category', denied: "Can't add group categories" },
      ],
      Owner: [
        { key: 'addusertogroup', label: 'Add Member', denied: "Can't add members to groups" },
        {
          key: 'removeuserfromgroup',
          label: 'Remove Member',
          denied: "Can't remove members from groups",
        },
        { key: 'deletegroup', label: 'Delete Group', denied: "Can't delete groups" },
        { key: 'attachroletogroup', label: 'Attach Role', denied: "Can't assign roles to groups" },
        {
          key: 'removerolefromgroup',
          label: 'Remove Role',
          denied: "Can't remove roles from groups",
        },
        { key: 'editgroupcategory', label: 'Edit Category', denied: "Can't edit group categories" },
        {
          key: 'deletegroupcategory',
          label: 'Delete Category',
          denied: "Can't delete group categories",
        },
      ],
      Admin: [],
    },
  },
  {
    scope: 'users',
    rules: {
      ReadOnly: [],
      Contributor: [{ key: 'createuser', label: 'Create User', denied: "Can't create members" }],
      Owner: [
        { key: 'deleteuser', label: 'Delete User', denied: "Can't delete members" },
        { key: 'attachroletouser', label: 'Attach Role', denied: "Can't assign roles to members" },
        {
          key: 'removerolefromuser',
          label: 'Remove Role',
          denied: "Can't remove roles from members",
        },
      ],
      Admin: [{ key: 'suspenduser', label: 'Suspend User', denied: "Can't suspend members" }],
    },
  },
  {
    scope: 'roles',
    rules: {
      ReadOnly: [
        {
          key: 'viewrolescategories',
          label: 'View Categories',
          denied: "Can't view role categories",
        },
      ],
      Contributor: [
        { key: 'createrole', label: 'Create Role', denied: "Can't create roles" },
        { key: 'editrole', label: 'Edit Role', denied: "Can't edit roles" },
        { key: 'addrolecategory', label: 'Add Category', denied: "Can't add role categories" },
      ],
      Owner: [
        { key: 'deleterole', label: 'Delete Role', denied: "Can't delete roles" },
        { key: 'editrolecategory', label: 'Edit Category', denied: "Can't edit role categories" },
        {
          key: 'deleterolecategory',
          label: 'Delete Category',
          denied: "Can't delete role categories",
        },
      ],
      Admin: [],
    },
  },
  {
    scope: 'settings',
    rules: {
      ReadOnly: [],
      Contributor: [
        {
          key: 'editdiscoveryconfig',
          label: 'Edit Discovery Config',
          denied: "Can't edit discovery settings",
        },
        {
          key: 'editsnapshotstorage',
          label: 'Edit Snapshot Storage',
          denied: "Can't edit snapshot storage",
        },
      ],
      Owner: [
        {
          key: 'controlainsights',
          label: 'Control AI Insights',
          denied: "Can't manage Insights settings",
        },
      ],
      Admin: [
        { key: 'editoidcconfig', label: 'Edit OIDC Config', denied: "Can't edit sign-in settings" },
      ],
    },
  },
  {
    scope: 'protection-plans',
    rules: {
      ReadOnly: [
        {
          key: 'viewprotectionplans',
          label: 'View Protection Plans',
          denied: "Can't view protection plans",
        },
        {
          key: 'viewprotectionplanviolations',
          label: 'View Violations',
          denied: "Can't view admission decisions",
        },
        { key: 'viewprotectionplanreports', label: 'View Reports', denied: "Can't view reports" },
        {
          key: 'downloadprotectionplanreport',
          label: 'Download Reports',
          denied: "Can't download reports",
        },
      ],
      Contributor: [
        {
          key: 'createprotectionplan',
          label: 'Create Protection Plan',
          denied: "Can't create protection plans",
        },
        {
          key: 'editprotectionplan',
          label: 'Edit Protection Plan',
          denied: "Can't edit protection plans",
        },
        {
          key: 'cancelprotectionplan',
          label: 'Cancel Protection Plan',
          denied: "Can't cancel protection plans",
        },
        {
          key: 'duplicateprotectionplan',
          label: 'Duplicate Protection Plan',
          denied: "Can't duplicate protection plans",
        },
        {
          key: 'reactivateprotectionplan',
          label: 'Reactivate Protection Plan',
          denied: "Can't reactivate protection plans",
        },
        {
          key: 'generateprotectionplanreport',
          label: 'Generate Reports',
          denied: "Can't generate reports",
        },
        {
          key: 'addprotectionplancategory',
          label: 'Add Kinds, Environments and Tags',
          denied: "Can't add kinds, environments or tags",
        },
      ],
      Owner: [
        {
          key: 'deleteprotectionplan',
          label: 'Delete Protection Plans and Reports',
          denied: "Can't delete protection plans or reports",
        },
        {
          key: 'approveprotectionplan',
          label: 'Approve Protection Plan',
          denied: "Can't approve protection plans",
        },
        {
          key: 'rejectprotectionplan',
          label: 'Reject Protection Plan',
          denied: "Can't reject protection plans",
        },
        {
          key: 'editprotectionplancategory',
          label: 'Edit Kinds, Environments and Tags',
          denied: "Can't edit kinds, environments or tags",
        },
        {
          key: 'deleteprotectionplancategory',
          label: 'Delete Kinds, Environments and Tags',
          denied: "Can't delete kinds, environments or tags",
        },
      ],
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

// A denied rule is stored as `<scope>.<rule>.deny`: its sentence, or the stored key if no scope lists it.
export const denyRuleSentence = (rule: string): string => {
  const [scope] = rule.split('.');
  const known = getScopeRules(scope, 'Admin');
  return known.find((r) => formatRuleKey(scope, r.key) === rule.toLowerCase())?.denied ?? rule;
};
