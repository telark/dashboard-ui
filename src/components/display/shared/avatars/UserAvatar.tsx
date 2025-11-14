import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import * as avatarStyles from '@dicebear/collection';
import { Avatar } from 'antd';
import type { UserAvatar as UserAvatarType } from '../../../../interfaces/resources/users';

interface UserAvatarProps {
  avatar?: UserAvatarType;
  username?: string;
  size?: number;
  style?: React.CSSProperties;
}

const AVATAR_STYLES: Record<string, any> = {
  avataaars: avatarStyles.avataaars,
  adventurer: avatarStyles.adventurer,
  'big-smile': avatarStyles.bigSmile,
  bottts: avatarStyles.bottts,
  'fun-emoji': avatarStyles.funEmoji,
  identicon: avatarStyles.identicon,
  lorelei: avatarStyles.lorelei,
  micah: avatarStyles.micah,
  miniavs: avatarStyles.miniavs,
  'open-peeps': avatarStyles.openPeeps,
  personas: avatarStyles.personas,
  'pixel-art': avatarStyles.pixelArt,
};

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, username, size = 40, style }) => {
  const avatarSrc = useMemo(() => {
    if (avatar && avatar.style && avatar.seed) {
      const styleConfig = AVATAR_STYLES[avatar.style];
      if (styleConfig) {
        const generated = createAvatar(styleConfig, {
          seed: avatar.seed,
          size: size * 2,
        });
        return generated.toDataUri();
      }
    }
    return undefined;
  }, [avatar, size]);

  return (
    <Avatar src={avatarSrc} size={size} style={style} alt={username || 'User'}>
      {!avatarSrc && username ? username.charAt(0).toUpperCase() : null}
    </Avatar>
  );
};

export default UserAvatar;
