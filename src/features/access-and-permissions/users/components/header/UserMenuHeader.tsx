import React from 'react';
import UserAvatarComponent from '../../../../../components/display/avatars/UserAvatar';
import { avatarRingStyle } from '../../../../../components/display/avatars/avatarRing';
import {
  FONT_SIZE,
  FONT_WEIGHT,
  HEADER_CONSTANTS,
  LINE_HEIGHT,
  SIDEBAR_USER_MENU,
  SPACING,
} from '../../../../../constants';
import type { User } from '../../models';

const INFO = HEADER_CONSTANTS.USER.USER_INFO;

const ellipsis: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const UserMenuHeader: React.FC<{ currentUser: User }> = ({ currentUser }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.MD,
      // 16px lines the avatar up with the menu item icons below (4px menu padding + 12px item padding).
      padding: `${SPACING.SM}px ${SPACING.LG}px`,
      backgroundColor: INFO.BACKGROUND,
      borderBottom: `1px solid ${INFO.BORDER_COLOR}`,
    }}
  >
    <div style={avatarRingStyle(INFO.AVATAR_SIZE)}>
      <UserAvatarComponent
        avatar={currentUser.avatar}
        username={currentUser.username}
        size={INFO.AVATAR_SIZE}
        style={{
          border: 'none',
          backgroundColor: INFO.AVATAR_FALLBACK_BG,
          color: INFO.AVATAR_FALLBACK_TEXT,
        }}
      />
    </div>
    <div style={{ minWidth: 0, lineHeight: LINE_HEIGHT.SNUG }}>
      <div
        style={{
          ...ellipsis,
          fontSize: FONT_SIZE.BASE,
          fontWeight: FONT_WEIGHT.SEMIBOLD,
          color: INFO.USERNAME_COLOR,
        }}
      >
        {currentUser.username || SIDEBAR_USER_MENU.FALLBACK_USERNAME}
      </div>
      {currentUser.email ? (
        <div
          title={currentUser.email}
          style={{ ...ellipsis, fontSize: FONT_SIZE.SM, color: INFO.EMAIL_COLOR }}
        >
          {currentUser.email}
        </div>
      ) : null}
    </div>
  </div>
);

export default UserMenuHeader;
