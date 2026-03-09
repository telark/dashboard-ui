import React, { useMemo } from 'react';
import { AssignedItemsList } from '../../../../shared';
import { GROUPS_CONSTANTS as GC, ATTACHED_MEMBERS_CONSTANTS as AMC } from '../../../constants';
import UserAvatar from '../../../../../../components/display/avatars/UserAvatar';
import { CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import type { User } from '../../../../users/models';

const renderMemberContent = (user: User): React.ReactNode => (
  <div style={AMC.LIST.MEMBER_CONTENT}>
    <div style={AMC.LIST.MEMBER_AVATAR_CONTAINER}>
      <UserAvatar avatar={user.avatar} username={user.username} size={32} />
    </div>
    <div style={AMC.LIST.MEMBER_INFO}>
      <div style={AMC.LIST.MEMBER_NAME}>{CapitalizeFirstLetter(user.username)}</div>
      {user.email && <div style={AMC.LIST.MEMBER_EMAIL}>{CapitalizeFirstLetter(user.email)}</div>}
    </div>
  </div>
);

interface GroupAssignedMembersViewProps {
  assignedUserIds: string[];
  allUsers?: User[];
  loading: boolean;
  onDeassignClick?: (user: User) => void;
}

const GroupAssignedMembersView: React.FC<GroupAssignedMembersViewProps> = ({
  assignedUserIds,
  allUsers,
  loading,
  onDeassignClick,
}) => {
  const assignedUsers = useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter((u) => assignedUserIds.includes(u.id));
  }, [allUsers, assignedUserIds]);

  return (
    <AssignedItemsList<User>
      items={assignedUsers}
      getItemKey={(u) => u.id}
      renderItemContent={renderMemberContent}
      loading={loading}
      emptyMessage={GC.LABELS.MESSAGES.NO_ASSIGNED_MEMBERS}
      loadingMessage={GC.LABELS.MESSAGES.LOADING_MEMBERS}
      onDeassignClick={onDeassignClick}
      deassignTooltip="Remove member"
    />
  );
};

export default GroupAssignedMembersView;
