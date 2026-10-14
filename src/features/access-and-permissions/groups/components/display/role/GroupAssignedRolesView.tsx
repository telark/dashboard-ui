import React, { useMemo } from 'react';
import { AssignedItemsList } from '../../../../shared';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { isBuiltInRole } from '../../../../roles/utils';
import type { Role } from '../../../../roles/models';
import AssignedRoleContent from './AssignedRoleContent';

const getScopeLabel = (scopeKey: string): string => {
  const area = RC.SCOPE.DEFAULT_AREAS.find((a) => a.key === scopeKey);
  return area?.label || scopeKey;
};

const renderRoleContent = (role: Role): React.ReactNode => (
  <AssignedRoleContent role={role} getScopeLabel={getScopeLabel} />
);

interface GroupAssignedRolesViewProps {
  assignedRoleIds: string[];
  allRoles?: Role[];
  loading: boolean;
  onDeassignClick?: (role: Role) => void;
  deassignDisabledReason?: (role: Role) => string | undefined;
  /** Opens the role in its own page's view panel. */
  onViewClick?: (role: Role) => void;
}

const GroupAssignedRolesView: React.FC<GroupAssignedRolesViewProps> = ({
  assignedRoleIds,
  allRoles,
  loading,
  onDeassignClick,
  deassignDisabledReason,
  onViewClick,
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
      deassignDisabledReason={deassignDisabledReason}
      onViewClick={onViewClick}
      viewLabel={GC.LABELS.ACTIONS.VIEW_ROLE}
      canView={(role) => !isBuiltInRole(role)}
      deassignTooltip="Remove role"
    />
  );
};

export default GroupAssignedRolesView;
