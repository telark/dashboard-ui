import React from 'react';
import { Tag } from 'antd';
import { AssignedItemsList } from '../../../../../shared';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { Icons, DEFAULT_COLORS, MENU_LABELS, TAG_CLASS } from '../../../../../../../constants';
import { NoPermissionCard } from '../../../../../../../components/shared';
import { ACTION_PERMISSIONS, usePermission } from '../../../../../../auth/hooks';
import { isRoleProtected, getRoleScopesContent } from '../../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../../../groups/constants';
import { getScopeLabel } from '../../../../utils/role/scope';
import type { GroupInheritedRole } from '../../../../hooks/panels/role/useGroupInheritedRoles';
import type { Group } from '../../../../../groups/models';

const RoleIcon = Icons.Role;
const VIEW_GROUPS = ACTION_PERMISSIONS.groups.view;

const renderRoleContent = (item: GroupInheritedRole): React.ReactNode => {
  const { role } = item;
  const isProtected = isRoleProtected(role);
  const scopesContent = getRoleScopesContent(role, {
    scopesAndPermissions: role.scopesAndPermissions || [],
    getScopeLabel,
    scopesContainerStyle: ARC.LIST.ROLE_SCOPES,
    scopeItemStyle: ARC.LIST.SCOPE_ITEM,
  });

  return (
    <div style={ARC.LIST.ROLE_CONTENT}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {isProtected && <RoleIcon size={14} color={DEFAULT_COLORS.SUCCESS} />}
        <span style={ARC.LIST.ROLE_NAME}>{role.name}</span>
      </div>
      {role.description && (
        <span style={ARC.LIST.ROLE_DESCRIPTION}>
          {CapitalizeFirstLetter(truncateText(role.description, 100))}
        </span>
      )}
      {scopesContent}
    </div>
  );
};

const renderGroupTags = (item: GroupInheritedRole): React.ReactNode => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 3,
      flexShrink: 0,
      marginTop: 2,
    }}
  >
    {item.fromGroups.map((group: Group) => (
      <Tag key={group.id} className={`${TAG_CLASS.MEDIUM} ${TAG_CLASS.AS_IS}`}>
        {group.name}
      </Tag>
    ))}
  </div>
);

interface UserGroupInheritedRolesViewProps {
  items: GroupInheritedRole[];
  loading: boolean;
}

const UserGroupInheritedRolesView: React.FC<UserGroupInheritedRolesViewProps> = ({
  items,
  loading,
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
      renderRightContent={renderGroupTags}
      loading={loading}
      emptyMessage={UC.LABELS.MESSAGES.NO_GROUP_ROLES}
      loadingMessage={UC.LABELS.MESSAGES.LOADING_ROLES}
    />
  );
};

export default UserGroupInheritedRolesView;
