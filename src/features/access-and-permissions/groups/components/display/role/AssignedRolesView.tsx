import React, { useCallback, useMemo } from 'react';
import { AssignedItemsList } from '../../../../shared';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import { isBuiltInRole } from '../../../../roles/utils';
import type { Role } from '../../../../roles/models';
import AssignedRoleContent from './AssignedRoleContent';

interface AssignedRolesViewProps {
  assignedRoleIds: string[];
  allRoles?: Role[];
  loading: boolean;
  onDeassignClick?: (role: Role) => void;
  deassignDisabledReason?: (role: Role) => string | undefined;
  /** Opens the role in its own page's view panel. */
  onViewClick?: (role: Role) => void;
  /** Role IDs inherited via group — deassign is blocked for these. */
  inheritedRoleIds?: Set<string>;
  /** Maps role ID → group names for inherited roles, named on their cards. */
  inheritedGroupsByRoleId?: Map<string, string[]>;
}

// Members' and groups' panels (view and Manage) share this list.
const AssignedRolesView: React.FC<AssignedRolesViewProps> = ({
  assignedRoleIds,
  allRoles,
  loading,
  onDeassignClick,
  deassignDisabledReason,
  onViewClick,
  inheritedRoleIds,
  inheritedGroupsByRoleId,
}) => {
  const assignedRoles = useMemo(() => {
    if (!allRoles) return [];
    return allRoles.filter((r) => assignedRoleIds.includes(r.id));
  }, [allRoles, assignedRoleIds]);

  const renderRoleContent = useCallback(
    (role: Role): React.ReactNode => (
      <AssignedRoleContent role={role} fromGroups={inheritedGroupsByRoleId?.get(role.id)} />
    ),
    [inheritedGroupsByRoleId],
  );

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
      canDeassign={(role) => !inheritedRoleIds?.has(role.id)}
    />
  );
};

export default AssignedRolesView;
