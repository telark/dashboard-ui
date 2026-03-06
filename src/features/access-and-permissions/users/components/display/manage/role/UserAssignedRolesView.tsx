import React, { useMemo } from 'react';
import { AssignedItemsList } from '../../../../../shared';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../../constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../../../groups/constants';
import { getScopeLabel } from '../../../../utils/role/scope';
import type { Role } from '../../../../../roles/models';

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
  /** Role IDs that are inherited via group membership — deassign is not allowed for these. */
  inheritedRoleIds?: Set<string>;
}

const UserAssignedRolesView: React.FC<UserAssignedRolesViewProps> = ({
  assignedRoleIds,
  allRoles,
  loading,
  onDeassignClick,
  inheritedRoleIds,
}) => {
  const assignedRoles = useMemo(() => {
    if (!allRoles) return [];
    return allRoles.filter((r) => assignedRoleIds.includes(r.id));
  }, [allRoles, assignedRoleIds]);

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
    />
  );
};

export default UserAssignedRolesView;
