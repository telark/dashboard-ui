import React, { useMemo } from 'react';
import { AssignedItemsList } from '../../../../../shared';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../../constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../../../groups/constants';
import { getScopeLabel } from '../../../../utils/role/scope';
import { GROUP_TAG_STYLE } from './styles';
import type { Role } from '../../../../../roles/models';

const GroupIcon = Icons.Group;

const GROUP_TAGS_WRAPPER: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 3,
  flexShrink: 0,
  marginTop: 2,
};

const RoleIcon = Icons.Role;

const renderRoleContent = (role: Role): React.ReactNode => {
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

interface UserAssignedRolesViewProps {
  assignedRoleIds: string[];
  allRoles?: Role[];
  loading: boolean;
  onDeassignClick?: (role: Role) => void;
  /** Role IDs inherited via group — deassign is blocked for these. */
  inheritedRoleIds?: Set<string>;
  /** Maps role ID → group names for inherited roles — renders source tags on their cards. */
  inheritedGroupsByRoleId?: Map<string, string[]>;
}

const UserAssignedRolesView: React.FC<UserAssignedRolesViewProps> = ({
  assignedRoleIds,
  allRoles,
  loading,
  onDeassignClick,
  inheritedRoleIds,
  inheritedGroupsByRoleId,
}) => {
  const assignedRoles = useMemo(() => {
    if (!allRoles) return [];
    return allRoles.filter((r) => assignedRoleIds.includes(r.id));
  }, [allRoles, assignedRoleIds]);

  const renderAssignmentSource = useMemo(() => {
    if (!inheritedGroupsByRoleId) return undefined;
    function renderGroupTags(role: Role): React.ReactNode {
      const groupNames = inheritedGroupsByRoleId!.get(role.id);
      if (!groupNames?.length) return undefined;
      return (
        <div style={GROUP_TAGS_WRAPPER}>
          {groupNames.map((name) => (
            <span key={name} style={GROUP_TAG_STYLE}>
              <GroupIcon size={10} />
              {name}
            </span>
          ))}
        </div>
      );
    }
    return renderGroupTags;
  }, [inheritedGroupsByRoleId]);

  return (
    <AssignedItemsList<Role>
      items={assignedRoles}
      getItemKey={(r) => r.id}
      renderItemContent={renderRoleContent}
      loading={loading}
      emptyMessage={UC.LABELS.MESSAGES.NO_ASSIGNED_ROLES}
      loadingMessage={UC.LABELS.MESSAGES.LOADING_ROLES}
      onDeassignClick={onDeassignClick}
      deassignTooltip="Remove role"
      canDeassign={(role) => !inheritedRoleIds?.has(role.id)}
      renderRightContent={renderAssignmentSource}
    />
  );
};

export default UserAssignedRolesView;
