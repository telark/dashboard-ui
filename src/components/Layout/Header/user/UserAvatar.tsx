import React from 'react';
import { Avatar } from 'antd';
import { DEFAULT_COLORS, HEADER_CONSTANTS } from '../../../../constants';
import UserAvatarComponent from '../../../display/shared/avatars/UserAvatar';
import type { User as AuthUser } from '../../../../interfaces/auth/credentials';
import type { User as UsersUser } from '../../../../interfaces/resources/users';

interface UserAvatarProps {
  currentUser: UsersUser | null;
  currentAuthUser: AuthUser | null;
  size: number;
  borderWidth: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  currentUser,
  currentAuthUser,
  size,
  borderWidth,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
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
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${HEADER_CONSTANTS.USER.AVATAR.HOVER_SCALE})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onKeyDown={handleKeyDown}
    >
      {(() => {
        if (currentUser?.avatar) {
          return (
            <UserAvatarComponent
              avatar={currentUser.avatar}
              username={currentUser.username}
              size={size}
              style={{ border: 'none' }}
            />
          );
        }
        if (currentUser) {
          return (
            <UserAvatarComponent
              username={currentUser.username}
              size={size}
              style={{ border: 'none' }}
            />
          );
        }
        if (currentAuthUser) {
          return (
            <UserAvatarComponent
              username={currentAuthUser.username}
              size={size}
              style={{ border: 'none' }}
            />
          );
        }
        return (
          <Avatar size={size} style={{ backgroundColor: DEFAULT_COLORS.SUCCESS }}>
            {'U'}
          </Avatar>
        );
      })()}
    </div>
  );
};

export default UserAvatar;
