import React, { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { Avatar } from 'antd';
import type { UserAvatar as UserAvatarType } from '../../../features/access-and-permissions/users/models';
import logger from '../../../logging';

interface UserAvatarProps {
  avatar?: UserAvatarType;
  username?: string;
  size?: number;
  style?: React.CSSProperties;
}

// Dynamic imports for avatar styles - loaded on-demand
const getAvatarStyle = async (styleName: string) => {
  switch (styleName) {
    case 'avataaars':
      return await import('@dicebear/avataaars');
    case 'adventurer':
      return await import('@dicebear/adventurer');
    case 'big-smile':
      return await import('@dicebear/big-smile');
    case 'bottts':
      return await import('@dicebear/bottts');
    case 'fun-emoji':
      return await import('@dicebear/fun-emoji');
    case 'identicon':
      return await import('@dicebear/identicon');
    case 'lorelei':
      return await import('@dicebear/lorelei');
    case 'micah':
      return await import('@dicebear/micah');
    case 'miniavs':
      return await import('@dicebear/miniavs');
    case 'open-peeps':
      return await import('@dicebear/open-peeps');
    case 'personas':
      return await import('@dicebear/personas');
    case 'pixel-art':
      return await import('@dicebear/pixel-art');
    default:
      return null;
  }
};

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, username, size = 40, style }) => {
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const generateAvatar = async () => {
      if (avatar?.style && avatar?.seed) {
        try {
          const styleModule = await getAvatarStyle(avatar.style);
          if (styleModule) {
            const generated = createAvatar(styleModule as any, {
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
