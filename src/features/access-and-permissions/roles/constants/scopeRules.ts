import type { PermissionLevel } from '../models/types';

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
      ],
    },
  },
  {
    scope: 'users',
    rules: {
      ReadOnly: [
        { key: 'viewalluserscategories', label: 'ViewAllUsersCategories' },
        { key: 'viewusercategory', label: 'ViewUserCategory' },
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
        { key: 'viewrolecategory', label: 'ViewRoleCategory' },
      ],
      Contributor: [
        { key: 'createrole', label: 'CreateRole' },
        { key: 'editrole', label: 'EditRole' },
        { key: 'viewrole', label: 'ViewRole' },
        { key: 'listallroles', label: 'ListAllRoles' },
        { key: 'viewrolecategory', label: 'ViewRoleCategory' },
      ],
      Owner: [
        { key: 'createrole', label: 'CreateRole' },
        { key: 'editrole', label: 'EditRole' },
        { key: 'viewrole', label: 'ViewRole' },
        { key: 'deleterole', label: 'DeleteRole' },
        { key: 'listallroles', label: 'ListAllRoles' },
        { key: 'viewrolecategory', label: 'ViewRoleCategory' },
        { key: 'assignroletogroup', label: 'AssignRoleToGroup' },
        { key: 'assignroletouser', label: 'AssignRoleToUser' },
      ],
      Admin: [
        { key: 'createrole', label: 'CreateRole' },
        { key: 'editrole', label: 'EditRole' },
        { key: 'viewrole', label: 'ViewRole' },
        { key: 'deleterole', label: 'DeleteRole' },
        { key: 'listallroles', label: 'ListAllRoles' },
        { key: 'viewrolecategory', label: 'ViewRoleCategory' },
        { key: 'assignroletogroup', label: 'AssignRoleToGroup' },
        { key: 'assignroletouser', label: 'AssignRoleToUser' },
        { key: 'managerolepermissions', label: 'ManageRolePermissions' },
      ],
    },
  },
];

export const getScopeRules = (scope: string, level: PermissionLevel): ScopeRule[] => {
  const scopeConfig = SCOPE_RULES.find((config) => config.scope === scope.toLowerCase());
  if (!scopeConfig) return [];
  return scopeConfig.rules[level] || [];
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
