import React, { useMemo } from 'react';
import { AssignedItemsList } from '../../../../../shared';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../../constants';
import { ATTACHED_MEMBERS_CONSTANTS as AMC } from '../../../../../groups/constants';
import { CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import type { Group } from '../../../../../groups/models';

const GroupIcon = Icons.Group;

const renderGroupContent = (group: Group): React.ReactNode => (
  <div style={AMC.LIST.MEMBER_CONTENT}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
        flexShrink: 0,
      }}
    >
      <GroupIcon size={22} />
    </div>
    <div style={AMC.LIST.MEMBER_INFO}>
      <div style={AMC.LIST.MEMBER_NAME}>{CapitalizeFirstLetter(group.name)}</div>
      {group.description && (
        <div style={AMC.LIST.MEMBER_EMAIL}>{CapitalizeFirstLetter(group.description)}</div>
      )}
    </div>
  </div>
);

interface UserAssignedGroupsViewProps {
  assignedGroupIds: string[];
  allGroups?: Group[];
  loading: boolean;
  onDeassignClick?: (group: Group) => void;
}

const UserAssignedGroupsView: React.FC<UserAssignedGroupsViewProps> = ({
  assignedGroupIds,
  allGroups,
  loading,
  onDeassignClick,
}) => {
  const assignedGroups = useMemo(() => {
    if (!allGroups) return [];
    return allGroups.filter((g) => assignedGroupIds.includes(g.id));
  }, [allGroups, assignedGroupIds]);

  return (
    <AssignedItemsList<Group>
      items={assignedGroups}
      getItemKey={(g) => g.id}
      renderItemContent={renderGroupContent}
      loading={loading}
      emptyMessage={UC.LABELS.MESSAGES.NO_ASSIGNED_GROUPS}
      loadingMessage={UC.LABELS.MESSAGES.LOADING_GROUPS}
      onDeassignClick={onDeassignClick}
      deassignTooltip="Remove group"
    />
  );
};

export default UserAssignedGroupsView;
