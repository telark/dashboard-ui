import React, { memo } from 'react';
import { DEFAULT_COLORS, HEADER_CONSTANTS } from '../../../../../constants';
import UserAvatarComponent from '../../../../../components/display/avatars/UserAvatar';
import type { User } from '../../models';

interface UserAvatarProps {
  currentUser: User | null;
  size: number;
  borderWidth: number;
}

const UserAvatar: React.FC<UserAvatarProps> = memo(({ currentUser, size, borderWidth }) => {
  if (!currentUser) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="User avatar"
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + borderWidth * 2,
        height: size + borderWidth * 2,
        borderRadius: '50%',
        border: `${borderWidth}px solid ${DEFAULT_COLORS.SUCCESS}`,
        padding: borderWidth,
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
