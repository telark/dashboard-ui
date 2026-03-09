import React, { useMemo } from 'react';
import { AssignedItemsList } from '../../../../shared';
import { GROUPS_CONSTANTS as GC, ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import type { Role } from '../../../../roles/models';

const RoleIcon = Icons.Role;

const getScopeLabel = (scopeKey: string): string => {
  const area = RC.SCOPE.DEFAULT_AREAS.find((a) => a.key === scopeKey);
  return area?.label || scopeKey;
};

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

interface GroupAssignedRolesViewProps {
  assignedRoleIds: string[];
  allRoles?: Role[];
  loading: boolean;
  onDeassignClick?: (role: Role) => void;
}

const GroupAssignedRolesView: React.FC<GroupAssignedRolesViewProps> = ({
  assignedRoleIds,
  allRoles,
  loading,
  onDeassignClick,
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
      emptyMessage={GC.LABELS.MESSAGES.NO_ASSIGNED_ROLES}
      loadingMessage={GC.LABELS.MESSAGES.LOADING_ROLES}
      onDeassignClick={onDeassignClick}
      deassignTooltip="Remove role"
    />
  );
};

export default GroupAssignedRolesView;
