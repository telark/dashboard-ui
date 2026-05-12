import React from 'react';
import UserAvatar from '../avatars/UserAvatar';
import { ATTACHED_MEMBERS_CONSTANTS as AMC } from '../../../features/access-and-permissions/groups/constants';
import type { User } from '../../../features/access-and-permissions/users/models';

interface UserOptionRowProps {
  user: User | undefined;
  displayName?: string;
  avatarSize?: number;
}

const UserOptionRow: React.FC<UserOptionRowProps> = ({
  user,
  displayName,
  avatarSize = 32,
}) => {
  const name = displayName ?? user?.username ?? '';
  return (
    <div style={AMC.LIST.MEMBER_CONTENT}>
      <div style={AMC.LIST.MEMBER_AVATAR_CONTAINER}>
        <UserAvatar avatar={user?.avatar} username={user?.username} size={avatarSize} />
      </div>
      <div style={AMC.LIST.MEMBER_INFO}>
        <div style={AMC.LIST.MEMBER_NAME}>{name}</div>
        {user?.email && <div style={AMC.LIST.MEMBER_EMAIL}>{user.email}</div>}
      </div>
    </div>
  );
};

export default UserOptionRow;
