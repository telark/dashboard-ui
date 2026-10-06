import React, { memo, useCallback, useState } from 'react';
import { CameraOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, EMPTY_VALUE, withAlpha } from '../../../../../constants';
import UserAvatar from '../../../../../components/display/avatars/UserAvatar';
import AvatarPicker from '../../../../../components/display/avatars/AvatarPicker';
import { avatarRingStyle } from '../../../../../components/display/avatars/avatarRing';
import SettingsCard from '../../../components/SettingsCard';
import { PROFILE_SECTION_CONSTANTS } from '../constants';
import type {
  User,
  UserAvatar as UserAvatarType,
} from '../../../../access-and-permissions/users/models';

const { LAYOUT, LABELS } = PROFILE_SECTION_CONSTANTS;

const CAMERA_ICON_COLOR = DEFAULT_COLORS.PILL_TEXT;
const OVERLAY_BG_HOVER = withAlpha(DEFAULT_COLORS.OVERLAY_BACKDROP, 0.55);

export interface ProfilePhotoCardProps {
  user: User | null;
  onAvatarChange?: (avatar: UserAvatarType) => void | Promise<void>;
}

const ProfilePhotoCard: React.FC<ProfilePhotoCardProps> = memo(({ user, onAvatarChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const avatarWrapperStyle = avatarRingStyle(LAYOUT.AVATAR_SIZE);

  const handleAvatarChange = useCallback(
    (avatar: UserAvatarType) => {
      onAvatarChange?.(avatar);
    },
    [onAvatarChange],
  );

  const avatarContent = (
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
            background: DEFAULT_COLORS.HOVER_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_MUTED,
          }}
        >
          {EMPTY_VALUE}
        </div>
      )}
    </div>
  );

  const avatarNode =
    onAvatarChange != null ? (
      <AvatarPicker
        value={user?.avatar}
        onChange={handleAvatarChange}
        size={LAYOUT.AVATAR_SIZE}
        okText="Update"
        trigger={(openModal) => (
          <button
            type="button"
            onClick={openModal}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Change profile photo"
            style={{
              cursor: 'pointer',
              position: 'relative',
              padding: 0,
              border: 'none',
              background: 'none',
              borderRadius: '50%',
              outline: 'none',
            }}
          >
            {avatarContent}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: OVERLAY_BG_HOVER,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.2s ease',
              }}
            >
              <CameraOutlined style={{ fontSize: 20, color: CAMERA_ICON_COLOR }} />
            </div>
          </button>
        )}
      />
    ) : (
      avatarContent
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
