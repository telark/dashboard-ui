import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../../store';
import { ACTION_PERMISSIONS, usePermission } from '../../../../../auth/hooks';
import { NoPermissionCard } from '../../../../../../components/shared';
import { ToggleButton } from '../../../../../../components/display/buttons';
import type { ViewPanelTab } from '../../../../../../components/display/panels/view/types';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { getEffectiveRoleRefs } from '../../../utils';
import { useGroupInheritedRoles } from '../role/useGroupInheritedRoles';
import UserAssignedRolesView from '../../../components/display/manage/role/UserAssignedRolesView';
import UserGroupInheritedRolesView from '../../../components/display/manage/role/UserGroupInheritedRolesView';
import UserAssignedGroupsView from '../../../components/display/manage/group/UserAssignedGroupsView';
import type { User } from '../../../models';
import type { Role } from '../../../../roles/models';
import type { Group } from '../../../../groups/models';
import ViewRolePanel from '../../../../roles/panels/role/ViewRolePanel';
import ViewGroupPanel from '../../../../groups/panels/group/ViewGroupPanel';

const VIEW_ROLES = ACTION_PERMISSIONS.roles.view;
const VIEW_GROUPS = ACTION_PERMISSIONS.groups.view;
const ROLES_TAB_STYLE: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const ROLE_SOURCE_STYLE: React.CSSProperties = { display: 'flex', gap: 8 };

type RoleSource = 'direct' | 'groups';

// The Members page loads roles and groups, so the tabs read them from the store. A role or group
// opens in its own view panel on top of this one; a stacked panel (`stacked`) opens nothing further.
export const useUserViewTabs = (
  user: User | null,
  stacked = false,
): { tabs: ViewPanelTab[]; stackedPanel: React.ReactNode } => {
  const { roles, loaded: rolesLoaded } = useSelector((state: RootState) => state.roles);
  const { groups, loaded: groupsLoaded } = useSelector((state: RootState) => state.groups);
  const canViewRoles = usePermission(VIEW_ROLES.scope, VIEW_ROLES.level);
  const canViewGroups = usePermission(VIEW_GROUPS.scope, VIEW_GROUPS.level);
  const groupInheritedRoles = useGroupInheritedRoles(user, roles, groups);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
  const [roleSource, setRoleSource] = useState<RoleSource>('direct');

  const tabs = useMemo(() => {
    if (!user) return [];
    const roleIds = getEffectiveRoleRefs(user, groups);
    const groupIds = user.groupRefs ?? [];
    return [
      {
        key: 'roles',
        label: UC.LABELS.PANELS.VIEW.TABS.ROLES,
        count: roleIds.length,
        content: canViewRoles ? (
          <div style={ROLES_TAB_STYLE}>
            <div style={ROLE_SOURCE_STYLE}>
              <ToggleButton
                active={roleSource === 'direct'}
                onClick={() => setRoleSource('direct')}
                label={UC.LABELS.PANELS.VIEW.DIRECT_ROLES_BUTTON}
                count={(user.roleRefs ?? []).length}
                tooltip={UC.LABELS.PANELS.VIEW.DIRECT_ROLES_TOOLTIP}
              />
              <ToggleButton
                active={roleSource === 'groups'}
                onClick={() => setRoleSource('groups')}
                label={UC.LABELS.PANELS.MANAGE_ROLE.FROM_GROUPS_BUTTON}
                count={groupInheritedRoles.length}
                tooltip={UC.LABELS.PANELS.MANAGE_ROLE.FROM_GROUPS_TOOLTIP}
              />
            </div>
            {roleSource === 'direct' ? (
              <UserAssignedRolesView
                assignedRoleIds={user.roleRefs ?? []}
                allRoles={roles}
                loading={!rolesLoaded}
                onViewClick={stacked ? undefined : setViewingRole}
              />
            ) : (
              <UserGroupInheritedRolesView
                items={groupInheritedRoles}
                loading={!rolesLoaded || !groupsLoaded}
                onViewClick={stacked ? undefined : setViewingRole}
              />
            )}
          </div>
        ) : (
          <NoPermissionCard
            featureName={UC.LABELS.PANELS.VIEW.TABS.ROLES}
            permission={VIEW_ROLES}
            compact
          />
        ),
      },
      {
        key: 'groups',
        label: UC.LABELS.PANELS.VIEW.TABS.GROUPS,
        count: groupIds.length,
        content: canViewGroups ? (
          <UserAssignedGroupsView
            assignedGroupIds={groupIds}
            allGroups={groups}
            loading={!groupsLoaded}
            onViewClick={stacked ? undefined : setViewingGroup}
          />
        ) : (
          <NoPermissionCard
            featureName={UC.LABELS.PANELS.VIEW.TABS.GROUPS}
            permission={VIEW_GROUPS}
            compact
          />
        ),
      },
    ];
  }, [
    user,
    roles,
    rolesLoaded,
    groups,
    groupsLoaded,
    canViewRoles,
    canViewGroups,
    groupInheritedRoles,
    roleSource,
    stacked,
  ]);

  const stackedPanel = (
    <>
      {viewingRole && (
        <ViewRolePanel open onClose={() => setViewingRole(null)} role={viewingRole} />
      )}
      {viewingGroup && (
        <ViewGroupPanel open onClose={() => setViewingGroup(null)} group={viewingGroup} stacked />
      )}
    </>
  );

  return { tabs, stackedPanel };
};
