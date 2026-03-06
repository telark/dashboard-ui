import React from 'react';
import { AssignedItemsList } from '../../../../../shared';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../../constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../../../groups/constants';
import { getScopeLabel } from '../../../../utils/role/scope';
import type { GroupInheritedRole } from '../../../../hooks/panels/role/useGroupInheritedRoles';
import type { Group } from '../../../../../groups/models';

const RoleIcon = Icons.Role;
const GroupIcon = Icons.Group;

const GROUP_TAG_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  fontSize: 12,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  padding: '2px 8px',
  background: `${DEFAULT_COLORS.SUCCESS}18`,
  borderRadius: 20,
  border: `1px solid ${DEFAULT_COLORS.SUCCESS}40`,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
};

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
        <span style={ARC.LIST.ROLE_NAME}>{CapitalizeFirstLetter(role.name)}</span>
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
      <span key={group.id} style={GROUP_TAG_STYLE}>
        <GroupIcon size={10} />
        {CapitalizeFirstLetter(group.name)}
      </span>
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
}) => (
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

export default UserGroupInheritedRolesView;
