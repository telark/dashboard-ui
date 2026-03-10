import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import UserAvatar from '../../../../../components/display/avatars/UserAvatar';
import SettingsCard from '../../../components/SettingsCard';
import { PROFILE_SECTION_CONSTANTS } from '../constants';
import type { User } from '../../../../access-and-permissions/users/models';

const { LAYOUT, LABELS } = PROFILE_SECTION_CONSTANTS;

export interface ProfilePhotoCardProps {
  user: User | null;
}

const ProfilePhotoCard: React.FC<ProfilePhotoCardProps> = memo(({ user }) => {
  const avatarWrapperSize = LAYOUT.AVATAR_SIZE + LAYOUT.AVATAR_BORDER_WIDTH * 2;
  const avatarWrapperStyle: React.CSSProperties = {
    width: avatarWrapperSize,
    height: avatarWrapperSize,
    flexShrink: 0,
    borderRadius: '50%',
    border: `${LAYOUT.AVATAR_BORDER_WIDTH}px solid ${DEFAULT_COLORS.SUCCESS}`,
    padding: LAYOUT.AVATAR_BORDER_WIDTH,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  };

  const avatarNode = (
    <div style={avatarWrapperStyle}>
      {user ? (
        <UserAvatar
          avatar={user.avatar}
          username={user.username}
          size={LAYOUT.AVATAR_SIZE}
          style={{ border: 'none' }}
        />
      ) : (
        <div
          style={{
            width: LAYOUT.AVATAR_SIZE,
            height: LAYOUT.AVATAR_SIZE,
            borderRadius: '50%',
            background: DEFAULT_COLORS.BACKGROUND_HOVER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_MUTED,
          }}
        >
          {LABELS.PLACEHOLDER}
        </div>
      )}
    </div>
  );

  return (
    <SettingsCard
      title={LABELS.PROFILE_PHOTO_CARD_TITLE}
      description={LABELS.PROFILE_PHOTO_CARD_DESCRIPTION}
      headerAction={avatarNode}
    >
      {null}
    </SettingsCard>
  );
});

ProfilePhotoCard.displayName = 'ProfilePhotoCard';

export default ProfilePhotoCard;
