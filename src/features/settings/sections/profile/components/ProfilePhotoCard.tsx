import React, { memo, useCallback, useState } from 'react';
import { CameraOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../constants';
import UserAvatar from '../../../../../components/display/avatars/UserAvatar';
import AvatarPicker from '../../../../../components/display/avatars/AvatarPicker';
import SettingsCard from '../../../components/SettingsCard';
import { PROFILE_SECTION_CONSTANTS } from '../constants';
import type {
  User,
  UserAvatar as UserAvatarType,
} from '../../../../access-and-permissions/users/models';

const { LAYOUT, LABELS } = PROFILE_SECTION_CONSTANTS;

const CAMERA_ICON_COLOR = '#fff';
const OVERLAY_BG_HOVER = 'rgba(0, 0, 0, 0.55)';

export interface ProfilePhotoCardProps {
  user: User | null;
  onAvatarChange?: (avatar: UserAvatarType) => void | Promise<void>;
}

const ProfilePhotoCard: React.FC<ProfilePhotoCardProps> = memo(
  ({ user, onAvatarChange }) => {
    const [isHovered, setIsHovered] = useState(false);
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
                <CameraOutlined
                  style={{ fontSize: 20, color: CAMERA_ICON_COLOR }}
                />
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
  },
);

ProfilePhotoCard.displayName = 'ProfilePhotoCard';

export default ProfilePhotoCard;
