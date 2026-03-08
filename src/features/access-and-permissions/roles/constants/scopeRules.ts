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
    scope: 'groupers',
    rules: {
      ReadOnly: [
        { key: 'viewsyncmode', label: 'ViewSyncMode' },
        { key: 'viewmaintenancemode', label: 'ViewMaintenanceMode' },
        { key: 'viewhistory', label: 'ViewHistory' },
      ],
      Contributor: [
        { key: 'changegroupersyncmode', label: 'ChangeGrouperSyncMode' },
        { key: 'syncgrouper', label: 'SyncGrouper' },
        { key: 'enablemaintenancemode', label: 'EnableMaintenanceMode' },
        { key: 'disablemaintenancemode', label: 'DisableMaintenanceMode' },
        { key: 'removemaintenancemode', label: 'RemoveMaintenanceMode' },
        { key: 'updatemaintenancemode', label: 'UpdateMaintenanceMode' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallgroupers', label: 'ListAllGroupers' },
      ],
      Owner: [
        { key: 'changegroupersyncmode', label: 'ChangeGrouperSyncMode' },
        { key: 'syncgrouper', label: 'SyncGrouper' },
        { key: 'enablemaintenancemode', label: 'EnableMaintenanceMode' },
        { key: 'disablemaintenancemode', label: 'DisableMaintenanceMode' },
        { key: 'removemaintenancemode', label: 'RemoveMaintenanceMode' },
        { key: 'updatemaintenancemode', label: 'UpdateMaintenanceMode' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallgroupers', label: 'ListAllGroupers' },
      ],
      Admin: [
        { key: 'changegroupersyncmode', label: 'ChangeGrouperSyncMode' },
        { key: 'syncgrouper', label: 'SyncGrouper' },
        { key: 'enablemaintenancemode', label: 'EnableMaintenanceMode' },
        { key: 'disablemaintenancemode', label: 'DisableMaintenanceMode' },
        { key: 'removemaintenancemode', label: 'RemoveMaintenanceMode' },
        { key: 'updatemaintenancemode', label: 'UpdateMaintenanceMode' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallgroupers', label: 'ListAllGroupers' },
      ],
    },
  },
  {
    scope: 'workloads',
    rules: {
      ReadOnly: [
        { key: 'viewappsyncmode', label: 'ViewAppSyncMode' },
        { key: 'viewbatchsyncmode', label: 'ViewBatchSyncMode' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallapps', label: 'ListAllApps' },
        { key: 'listallbatches', label: 'ListAllBatches' },
      ],
      Contributor: [
        { key: 'changeappsyncmode', label: 'ChangeAppSyncMode' },
        { key: 'changebatchsyncmode', label: 'ChangeBatchSyncMode' },
        { key: 'syncapp', label: 'SyncApp' },
        { key: 'syncbatch', label: 'SyncBatch' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallapps', label: 'ListAllApps' },
        { key: 'listallbatches', label: 'ListAllBatches' },
      ],
      Owner: [
        { key: 'changeappsyncmode', label: 'ChangeAppSyncMode' },
        { key: 'changebatchsyncmode', label: 'ChangeBatchSyncMode' },
        { key: 'syncapp', label: 'SyncApp' },
        { key: 'syncbatch', label: 'SyncBatch' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallapps', label: 'ListAllApps' },
        { key: 'listallbatches', label: 'ListAllBatches' },
      ],
      Admin: [
        { key: 'changeappsyncmode', label: 'ChangeAppSyncMode' },
        { key: 'changebatchsyncmode', label: 'ChangeBatchSyncMode' },
        { key: 'syncapp', label: 'SyncApp' },
        { key: 'syncbatch', label: 'SyncBatch' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallapps', label: 'ListAllApps' },
        { key: 'listallbatches', label: 'ListAllBatches' },
      ],
    },
  },
  {
    scope: 'bridges',
    rules: {
      ReadOnly: [
        { key: 'listallbridges', label: 'ListAllBridges' },
        { key: 'viewhistory', label: 'ViewHistory' },
      ],
      Contributor: [
        { key: 'changebridgesyncmode', label: 'ChangeBridgeSyncMode' },
        { key: 'syncbridge', label: 'SyncBridge' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallbridges', label: 'ListAllBridges' },
      ],
      Owner: [
        { key: 'changebridgesyncmode', label: 'ChangeBridgeSyncMode' },
        { key: 'syncbridge', label: 'SyncBridge' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallbridges', label: 'ListAllBridges' },
      ],
      Admin: [
        { key: 'changebridgesyncmode', label: 'ChangeBridgeSyncMode' },
        { key: 'syncbridge', label: 'SyncBridge' },
        { key: 'viewhistory', label: 'ViewHistory' },
        { key: 'listallbridges', label: 'ListAllBridges' },
      ],
    },
  },
  {
    scope: 'groups',
    rules: {
      ReadOnly: [
        { key: 'viewallgroupscategories', label: 'ViewAllGroupsCategories' },
        { key: 'viewgroupcategory', label: 'ViewGroupCategory' },
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
