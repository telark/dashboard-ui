import React, { memo } from 'react';
import { HEADER_CONSTANTS } from '../../../../../constants';
import UserAvatarComponent from '../../../../../components/display/avatars/UserAvatar';
import { avatarRingStyle } from '../../../../../components/display/avatars/avatarRing';
import type { User } from '../../models';

interface UserAvatarProps {
  currentUser: User | null;
  size: number;
}

const UserAvatar: React.FC<UserAvatarProps> = memo(({ currentUser, size }) => {
  if (!currentUser) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="User avatar"
      style={{
        ...avatarRingStyle(size),
        cursor: 'pointer',
        transition: HEADER_CONSTANTS.USER.AVATAR.TRANSITION,
        background: 'transparent',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${HEADER_CONSTANTS.USER.AVATAR.HOVER_SCALE})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {currentUser.avatar ? (
        <UserAvatarComponent
          avatar={currentUser.avatar}
          username={currentUser.username}
          size={size}
          style={{ border: 'none' }}
        />
      ) : (
        <UserAvatarComponent
          username={currentUser.username}
          size={size}
          style={{ border: 'none' }}
        />
      )}
    </button>
  );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
