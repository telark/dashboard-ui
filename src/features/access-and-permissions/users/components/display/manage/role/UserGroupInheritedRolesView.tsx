import React from 'react';
import { AssignedItemsList } from '../../../../../shared';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../../../roles/constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../../../groups/constants';
import type { GroupInheritedRole } from '../../../../hooks/panels/role/useGroupInheritedRoles';

const RoleIcon = Icons.Role;
const GroupIcon = Icons.Group;

const GROUP_TAG_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 11,
  color: DEFAULT_COLORS.CHIP_BLUE_TEXT,
  padding: '2px 8px',
  background: DEFAULT_COLORS.CHIP_BLUE_BG,
  borderRadius: 20,
  border: `1px solid ${DEFAULT_COLORS.CHIP_BLUE_TEXT}30`,
  lineHeight: 1.4,
  whiteSpace: 'nowrap' as const,
};

const getScopeLabel = (scopeKey: string): string => {
  const area = RC.SCOPE.DEFAULT_AREAS.find((a) => a.key === scopeKey);
  return area?.label || scopeKey;
};

const renderInheritedRoleContent = (item: GroupInheritedRole): React.ReactNode => {
  const { role, fromGroups } = item;
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
        {fromGroups.map((group) => (
          <span key={group.id} style={GROUP_TAG_STYLE}>
            <GroupIcon size={10} />
            {CapitalizeFirstLetter(group.name)}
          </span>
        ))}
      </div>
    </div>
  );
};

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
    renderItemContent={renderInheritedRoleContent}
    loading={loading}
    emptyMessage={UC.LABELS.MESSAGES.NO_GROUP_ROLES}
    loadingMessage={UC.LABELS.MESSAGES.LOADING_ROLES}
  />
);

export default UserGroupInheritedRolesView;
