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

// Generated images by style, seed and size: a remount, or a new avatar object for the same person,
// shows the image at once instead of initials, which antd measures (forced layout) per avatar.
const generatedAvatars = new Map<string, string>();

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, username, size = 40, style }) => {
  const avatarStyle = avatar?.style;
  const seed = avatar?.seed;
  const cacheKey = `${avatarStyle}|${seed}|${size}`;
  const [avatarSrc, setAvatarSrc] = useState(() => generatedAvatars.get(cacheKey));

  useEffect(() => {
    const generateAvatar = async () => {
      if (avatarStyle && seed) {
        const cached = generatedAvatars.get(cacheKey);
        if (cached) {
          setAvatarSrc(cached);
          return;
        }
        try {
          const styleModule = await loadAvatarStyle(avatarStyle);
          if (styleModule) {
            const generated = createAvatar(styleModule, {
              seed,
              size: size * 2,
            }).toDataUri();
            generatedAvatars.set(cacheKey, generated);
            setAvatarSrc(generated);
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
  }, [avatarStyle, seed, size, cacheKey]);

  return (
    // antd's overflow:hidden drops the flex min-width to 0, so a crowded row squeezes it oval.
    <Avatar
      src={avatarSrc}
      size={size}
      style={{ flexShrink: 0, ...style }}
      alt={username || 'User'}
    >
      {!avatarSrc && username ? username.charAt(0).toUpperCase() : null}
    </Avatar>
  );
};

export default UserAvatar;
