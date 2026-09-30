import React, { memo } from 'react';
import UserAvatar from '../avatars/UserAvatar';
import { DEFAULT_COLORS } from '../../../constants/shared/colors';
import { AVATAR_RING } from '../../../constants/layout/avatars';
import type { User } from '../../../features/access-and-permissions/users/models';

interface UserDisplayProps {
  user: (Pick<User, 'username' | 'avatar'> & Partial<Pick<User, 'fullname'>>) | null | undefined;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
  className?: string;
  title?: string;
}

const SIZE_CONFIG = {
  small: { avatar: 16, container: 23, gap: 6 },
  medium: { avatar: 20, container: 28, gap: 8 },
  large: { avatar: 24, container: 32, gap: 10 },
} as const;

const UserDisplay: React.FC<UserDisplayProps> = memo(
  ({ user, size = 'small', showBorder = true, className, title }) => {
    if (!user) {
      return <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}>—</span>;
    }

    const displayName = user.fullname || user.username;
    const config = SIZE_CONFIG[size];

    return (
      <div
        className={className}
        title={title}
        style={{ display: 'flex', alignItems: 'center', gap: config.gap }}
      >
        {showBorder ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: config.container,
              height: config.container,
              flexShrink: 0,
              borderRadius: '50%',
              // Container sizes are deliberately wider than the shared ring
              // formula, so only the ring itself is shared here.
              border: `${AVATAR_RING.BORDER_WIDTH}px solid ${DEFAULT_COLORS.SUCCESS}`,
              padding: AVATAR_RING.BORDER_WIDTH,
              background: 'transparent',
            }}
          >
            <UserAvatar
              avatar={user.avatar}
              username={user.username}
              size={config.avatar}
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <UserAvatar avatar={user.avatar} username={user.username} size={config.avatar} />
        )}
        <span>{displayName}</span>
      </div>
    );
  },
);

UserDisplay.displayName = 'UserDisplay';

export default UserDisplay;
