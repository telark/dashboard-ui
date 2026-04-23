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
        { key: 'viewapplicationsrollbacks', label: 'ViewApplicationsRollbacks' },
        { key: 'viewapplicationssnapshots', label: 'ViewApplicationsSnapshots' },
        { key: 'viewapplicationsnapshotmanifest', label: 'ViewApplicationsSnapshotManifest' },
      ],
      Contributor: [
        { key: 'editapplication', label: 'EditApplication' },
        { key: 'forceapplicationsync', label: 'ForceApplicationSync' },
        { key: 'rollbackapplication', label: 'RollbackApplication' },
        { key: 'deleteapplication', label: 'DeleteApplication' },
      ],
      Owner: [
        { key: 'editapplication', label: 'EditApplication' },
        { key: 'forceapplicationsync', label: 'ForceApplicationSync' },
        { key: 'rollbackapplication', label: 'RollbackApplication' },
        { key: 'deleteapplication', label: 'DeleteApplication' },
      ],
      Admin: [
        { key: 'editapplication', label: 'EditApplication' },
        { key: 'forceapplicationsync', label: 'ForceApplicationSync' },
        { key: 'rollbackapplication', label: 'RollbackApplication' },
        { key: 'deleteapplication', label: 'DeleteApplication' },
      ],
    },
  },
  {
    scope: 'groups',
    rules: {
      ReadOnly: [
        { key: 'viewgroupscategories', label: 'ViewGroupsCategories' },
        { key: 'viewgroupattachedroles', label: 'ViewGroupAttachedRoles' },
      ],
      Contributor: [
        { key: 'creategroup', label: 'CreateGroup' },
        { key: 'editgroup', label: 'EditGroup' },
        { key: 'viewgroup', label: 'ViewGroup' },
        { key: 'deletegroup', label: 'DeleteGroup' },
        { key: 'listallgroups', label: 'ListAllGroups' },
        { key: 'attachroletogroup', label: 'AttachRoleToGroup' },
        { key: 'removerolefromgroup', label: 'RemoveRoleFromGroup' },
        { key: 'addusertogroup', label: 'AddUserToGroup' },
        { key: 'removeuserfromgroup', label: 'RemoveUserFromGroup' },
        { key: 'addgroupcategory', label: 'AddGroupCategory' },
      ],
      Owner: [
        { key: 'creategroup', label: 'CreateGroup' },
        { key: 'editgroup', label: 'EditGroup' },
        { key: 'viewgroup', label: 'ViewGroup' },
        { key: 'deletegroup', label: 'DeleteGroup' },
        { key: 'listallgroups', label: 'ListAllGroups' },
        { key: 'attachroletogroup', label: 'AttachRoleToGroup' },
        { key: 'removerolefromgroup', label: 'RemoveRoleFromGroup' },
        { key: 'addusertogroup', label: 'AddUserToGroup' },
        { key: 'removeuserfromgroup', label: 'RemoveUserFromGroup' },
        { key: 'addgroupcategory', label: 'AddGroupCategory' },
      ],
      Admin: [
        { key: 'creategroup', label: 'CreateGroup' },
        { key: 'editgroup', label: 'EditGroup' },
        { key: 'viewgroup', label: 'ViewGroup' },
        { key: 'deletegroup', label: 'DeleteGroup' },
        { key: 'listallgroups', label: 'ListAllGroups' },
        { key: 'attachroletogroup', label: 'AttachRoleToGroup' },
        { key: 'removerolefromgroup', label: 'RemoveRoleFromGroup' },
        { key: 'addusertogroup', label: 'AddUserToGroup' },
        { key: 'removeuserfromgroup', label: 'RemoveUserFromGroup' },
        { key: 'addgroupcategory', label: 'AddGroupCategory' },
      ],
    },
  },
  {
    scope: 'users',
    rules: {
      ReadOnly: [
        { key: 'viewuserattachedroles', label: 'ViewUserAttachedRoles' },
      ],
      Contributor: [
        { key: 'createuser', label: 'CreateUser' },
        { key: 'edituser', label: 'EditUser' },
        { key: 'viewuser', label: 'ViewUser' },
        { key: 'deleteuser', label: 'DeleteUser' },
        { key: 'listallusers', label: 'ListAllUsers' },
        { key: 'attachroletouser', label: 'AttachRoleToUser' },
        { key: 'removerolefromuser', label: 'RemoveRoleFromUser' },
        { key: 'addusertogroup', label: 'AddUserToGroup' },
        { key: 'removeuserfromgroup', label: 'RemoveUserFromGroup' },
      ],
      Owner: [
        { key: 'createuser', label: 'CreateUser' },
        { key: 'edituser', label: 'EditUser' },
        { key: 'viewuser', label: 'ViewUser' },
        { key: 'deleteuser', label: 'DeleteUser' },
        { key: 'listallusers', label: 'ListAllUsers' },
        { key: 'attachroletouser', label: 'AttachRoleToUser' },
        { key: 'removerolefromuser', label: 'RemoveRoleFromUser' },
        { key: 'addusertogroup', label: 'AddUserToGroup' },
        { key: 'removeuserfromgroup', label: 'RemoveUserFromGroup' },
      ],
      Admin: [
        { key: 'createuser', label: 'CreateUser' },
        { key: 'edituser', label: 'EditUser' },
        { key: 'viewuser', label: 'ViewUser' },
        { key: 'deleteuser', label: 'DeleteUser' },
        { key: 'listallusers', label: 'ListAllUsers' },
        { key: 'attachroletouser', label: 'AttachRoleToUser' },
        { key: 'removerolefromuser', label: 'RemoveRoleFromUser' },
        { key: 'addusertogroup', label: 'AddUserToGroup' },
        { key: 'removeuserfromgroup', label: 'RemoveUserFromGroup' },
      ],
    },
  },
  {
    scope: 'roles',
    rules: {
      ReadOnly: [
        { key: 'viewrole', label: 'ViewRole' },
        { key: 'listallroles', label: 'ListAllRoles' },
        { key: 'viewrolescategories', label: 'ViewRolesCategories' },
      ],
      Contributor: [
        { key: 'createrole', label: 'CreateRole' },
        { key: 'editrole', label: 'EditRole' },
        { key: 'viewrole', label: 'ViewRole' },
        { key: 'listallroles', label: 'ListAllRoles' },
        { key: 'addrolecategory', label: 'AddRoleCategory' },
      ],
      Owner: [
        { key: 'createrole', label: 'CreateRole' },
        { key: 'editrole', label: 'EditRole' },
        { key: 'viewrole', label: 'ViewRole' },
        { key: 'deleterole', label: 'DeleteRole' },
        { key: 'listallroles', label: 'ListAllRoles' },
        { key: 'assignroletogroup', label: 'AssignRoleToGroup' },
        { key: 'assignroletouser', label: 'AssignRoleToUser' },
        { key: 'addrolecategory', label: 'AddRoleCategory' },
      ],
      Admin: [
        { key: 'createrole', label: 'CreateRole' },
        { key: 'editrole', label: 'EditRole' },
        { key: 'viewrole', label: 'ViewRole' },
        { key: 'deleterole', label: 'DeleteRole' },
        { key: 'listallroles', label: 'ListAllRoles' },
        { key: 'assignroletogroup', label: 'AssignRoleToGroup' },
        { key: 'assignroletouser', label: 'AssignRoleToUser' },
        { key: 'managerolepermissions', label: 'ManageRolePermissions' },
        { key: 'addrolecategory', label: 'AddRoleCategory' },
      ],
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
