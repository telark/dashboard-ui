import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../../store';
import { ACTION_PERMISSIONS, usePermission } from '../../../../../auth/hooks';
import { NoPermissionCard } from '../../../../../../components/shared';
import type { ViewPanelTab } from '../../../../../../components/display/panels/view/types';
import { useRoles } from '../../../../roles/hooks';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import GroupAssignedMembersView from '../../../components/display/member/GroupAssignedMembersView';
import AssignedRolesView from '../../../components/display/role/AssignedRolesView';
import type { Group } from '../../../models';
import type { User } from '../../../../users/models';
import type { Role } from '../../../../roles/models';
import ViewUserPanel from '../../../../users/panels/user/ViewUserPanel';
import ViewRolePanel from '../../../../roles/panels/role/ViewRolePanel';

const VIEW_USERS = ACTION_PERMISSIONS.users.view;
const VIEW_ROLES = ACTION_PERMISSIONS.roles.view;

// A member or role opens in its own view panel on top of this one; a stacked panel (`stacked`)
// opens nothing further.
export const useGroupViewTabs = (
  group: Group | null,
  stacked = false,
): { tabs: ViewPanelTab[]; stackedPanel: React.ReactNode } => {
  // The Groups page doesn't load roles; useViewGroupPanel already loads the users.
  const { roles, loaded: rolesLoaded } = useRoles();
  const { users, loaded: usersLoaded } = useSelector((state: RootState) => state.users);
  const canViewUsers = usePermission(VIEW_USERS.scope, VIEW_USERS.level);
  const canViewRoles = usePermission(VIEW_ROLES.scope, VIEW_ROLES.level);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);

  const tabs = useMemo(() => {
    if (!group) return [];
    const userIds = group.userRefs ?? [];
    const roleIds = group.roleRefs ?? [];
    return [
      {
        key: 'members',
        label: GC.LABELS.PANELS.VIEW.TABS.MEMBERS,
        count: userIds.length,
        content: canViewUsers ? (
          <GroupAssignedMembersView
            assignedUserIds={userIds}
            allUsers={users}
            loading={!usersLoaded}
            onViewClick={stacked ? undefined : setViewingUser}
          />
        ) : (
          <NoPermissionCard
            featureName={GC.LABELS.PANELS.VIEW.TABS.MEMBERS}
            permission={VIEW_USERS}
            compact
          />
        ),
      },
      {
        key: 'roles',
        label: GC.LABELS.PANELS.VIEW.TABS.ROLES,
        count: roleIds.length,
        content: canViewRoles ? (
          <AssignedRolesView
            assignedRoleIds={roleIds}
            allRoles={roles}
            loading={!rolesLoaded}
            onViewClick={stacked ? undefined : setViewingRole}
          />
        ) : (
          <NoPermissionCard
            featureName={GC.LABELS.PANELS.VIEW.TABS.ROLES}
            permission={VIEW_ROLES}
            compact
          />
        ),
      },
    ];
  }, [group, users, usersLoaded, roles, rolesLoaded, canViewUsers, canViewRoles, stacked]);

  const stackedPanel = (
    <>
      {viewingUser && (
        <ViewUserPanel open onClose={() => setViewingUser(null)} user={viewingUser} stacked />
      )}
      {viewingRole && (
        <ViewRolePanel open onClose={() => setViewingRole(null)} role={viewingRole} />
      )}
    </>
  );

  return { tabs, stackedPanel };
};
