import React, { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { Avatar } from 'antd';
import type { UserAvatar as UserAvatarType } from '../../../features/access-and-permissions/users/models';
import logger from '../../../logging';
import { loadAvatarStyle } from '../../../utils/layout/user-avatar/loadAvatarStyles';

interface UserAvatarProps {
  avatar?: UserAvatarType;
  username?: string;
  size?: number;
  style?: React.CSSProperties;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, username, size = 40, style }) => {
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const generateAvatar = async () => {
      if (avatar?.style && avatar?.seed) {
        try {
          const styleModule = await loadAvatarStyle(avatar.style);
          if (styleModule) {
            const generated = createAvatar(styleModule, {
              seed: avatar.seed,
              size: size * 2,
            });
            setAvatarSrc(generated.toDataUri());
          } else {
            setAvatarSrc(undefined);
          }
        } catch (error) {
          logger.error('Failed to load avatar style:', error);
          setAvatarSrc(undefined);
        }
      } else {
        setAvatarSrc(undefined);
      }
    };

    generateAvatar();
  }, [avatar, size]);

  return (
    <Avatar src={avatarSrc} size={size} style={style} alt={username || 'User'}>
      {!avatarSrc && username ? username.charAt(0).toUpperCase() : null}
    </Avatar>
  );
};

export default UserAvatar;
