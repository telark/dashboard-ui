import React from 'react';
import { AssignedItemsList } from '../../../../../shared';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { MENU_LABELS } from '../../../../../../../constants';
import { NoPermissionCard } from '../../../../../../../components/shared';
import { ACTION_PERMISSIONS, usePermission } from '../../../../../../auth/hooks';
import { isBuiltInRole } from '../../../../../roles/utils';
import AssignedRoleContent from '../../../../../groups/components/display/role/AssignedRoleContent';
import { getScopeLabel } from '../../../../utils/role/scope';
import type { GroupInheritedRole } from '../../../../hooks/panels/role/useGroupInheritedRoles';
import type { Role } from '../../../../../roles/models';

const VIEW_GROUPS = ACTION_PERMISSIONS.groups.view;

const renderRoleContent = ({ role, fromGroups }: GroupInheritedRole): React.ReactNode => (
  <AssignedRoleContent
    role={role}
    getScopeLabel={getScopeLabel}
    fromGroups={fromGroups.map((g) => g.name)}
  />
);

interface UserGroupInheritedRolesViewProps {
  items: GroupInheritedRole[];
  loading: boolean;
  /** Opens the role in its own view panel. */
  onViewClick?: (role: Role) => void;
}

const UserGroupInheritedRolesView: React.FC<UserGroupInheritedRolesViewProps> = ({
  items,
  loading,
  onViewClick,
}) => {
  // Without groups read the list would just look empty, as if no group granted a role.
  const canViewGroups = usePermission(VIEW_GROUPS.scope, VIEW_GROUPS.level);
  if (!canViewGroups) {
    return <NoPermissionCard featureName={MENU_LABELS.GROUPS} permission={VIEW_GROUPS} compact />;
  }
  return (
    <AssignedItemsList<GroupInheritedRole>
      items={items}
      getItemKey={(item) => item.role.id}
      renderItemContent={renderRoleContent}
      loading={loading}
      emptyMessage={UC.LABELS.MESSAGES.NO_GROUP_ROLES}
      loadingMessage={UC.LABELS.MESSAGES.LOADING_ROLES}
      onViewClick={onViewClick ? (item) => onViewClick(item.role) : undefined}
      viewLabel={UC.LABELS.ACTIONS.VIEW_ROLE}
      canView={(item) => !isBuiltInRole(item.role)}
    />
  );
};

export default UserGroupInheritedRolesView;
