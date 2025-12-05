import React, { memo } from 'react';
import UserAvatar from '../avatars/UserAvatar';
import { DEFAULT_COLORS } from '../../../constants/shared/colors';
import type { User } from '../../../features/access-and-permissions/users/models';

interface UserDisplayProps {
  user: User | null | undefined;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  small: { avatar: 16, container: 23, gap: 6 },
  medium: { avatar: 20, container: 28, gap: 8 },
  large: { avatar: 24, container: 32, gap: 10 },
} as const;

const UserDisplay: React.FC<UserDisplayProps> = memo(
  ({ user, size = 'small', showBorder = true, className }) => {
    if (!user) {
      return <span style={{ color: '#64748b' }}>—</span>;
    }

    const displayName = user.fullname || user.username;
    const config = SIZE_CONFIG[size];

    return (
      <div
        className={className}
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
              borderRadius: '50%',
              border: `1.5px solid ${DEFAULT_COLORS.SUCCESS}`,
              padding: 1.5,
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
          <UserAvatar
            avatar={user.avatar}
            username={user.username}
            size={config.avatar}
          />
        )}
        <span>{displayName}</span>
      </div>
    );
  },
);

UserDisplay.displayName = 'UserDisplay';

export default UserDisplay;

