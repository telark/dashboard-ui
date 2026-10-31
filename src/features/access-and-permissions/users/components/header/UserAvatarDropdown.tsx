import React, { useState, useEffect, memo } from 'react';
import { Dropdown, App as AntdApp, theme } from 'antd';
import { HiChevronUpDown } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  CURRENT_USER_UPDATED_EVENT,
  handleUserLogout,
} from '../../../../auth/utils';
import { fetchCurrentUserDetails } from '../../utils';
import { createUserMenuItems } from './UserMenuItems';
import UserAvatar from './UserAvatar';
import UserMenuHeader from './UserMenuHeader';
import UserAvatarComponent from '../../../../../components/display/avatars/UserAvatar';
import { avatarRingStyle } from '../../../../../components/display/avatars/avatarRing';
import {
  AVATAR_RING,
  BUTTON_CONFIGS,
  DEFAULT_COLORS,
  HEADER_CONSTANTS,
  SIDEBAR_LAYOUT,
  SIDEBAR_USER_MENU,
  getSidebarLabelFade,
} from '../../../../../constants';
import type { User } from '../../models';

// The ringed avatar (size + 4 × ring border, see avatarRingStyle) centered in the collapsed row.
const SIDEBAR_AVATAR_COLLAPSED_INSET =
  (SIDEBAR_LAYOUT.WIDTH_COLLAPSED -
    2 * BUTTON_CONFIGS.SIDEBAR_BUTTON.COLLAPSED_MARGIN_X -
    (SIDEBAR_USER_MENU.AVATAR.SIZE + 4 * AVATAR_RING.BORDER_WIDTH)) /
  2;

interface UserAvatarDropdownProps {
  variant?: 'header' | 'sidebar';
  isCollapsed?: boolean;
}

const UserAvatarDropdown: React.FC<UserAvatarDropdownProps> = memo(
  ({ variant = 'header', isCollapsed = false }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
    const [loggingOut, setLoggingOut] = useState(false);
    const [rowHovered, setRowHovered] = useState(false);
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();
    const { token } = theme.useToken();

    useEffect(() => {
      const initialUser = getCurrentUser();

      if (initialUser?.id) {
        fetchCurrentUserDetails((user) => {
          setCurrentUser(user);
        });
      }

      const handleCurrentUserUpdated = (e: Event) => {
        const user = (e as CustomEvent<User>).detail;
        if (user) setCurrentUser(user);
      };
      globalThis.addEventListener(CURRENT_USER_UPDATED_EVENT, handleCurrentUserUpdated);
      return () => {
        globalThis.removeEventListener(CURRENT_USER_UPDATED_EVENT, handleCurrentUserUpdated);
      };
    }, []);

    const handleLogout = async () => {
      setLoggingOut(true);
      try {
        await handleUserLogout(navigate, message);
      } finally {
        setLoggingOut(false);
      }
    };

    const handleLogoutWrapper = () => {
      void handleLogout();
    };

    // Don't render anything if no user - avoid flash of 'U' on page load
    if (!currentUser) {
      return null;
    }

    const menuItems = createUserMenuItems({
      onNavigate: (route) => void navigate(route),
      onLogout: handleLogoutWrapper,
      loggingOut,
    });

    const isSidebar = variant === 'sidebar';
    const row = BUTTON_CONFIGS.SIDEBAR_BUTTON;

    return (
      <Dropdown
        menu={{ items: menuItems }}
        placement={isSidebar ? SIDEBAR_USER_MENU.PLACEMENT : HEADER_CONSTANTS.USER.MENU.PLACEMENT}
        trigger={['click']}
        rootClassName={HEADER_CONSTANTS.USER.MENU.ROOT_CLASS}
        styles={{ root: { width: HEADER_CONSTANTS.USER.MENU.WIDTH } }}
        popupRender={(menu) => (
          <div
            style={{
              backgroundColor: DEFAULT_COLORS.SURFACE_WHITE,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadowSecondary,
              overflow: 'hidden',
            }}
          >
            <UserMenuHeader currentUser={currentUser} />
            {menu}
          </div>
        )}
      >
        {isSidebar ? (
          <button
            type="button"
            aria-label={SIDEBAR_USER_MENU.ARIA_LABEL}
            onMouseEnter={() => setRowHovered(true)}
            onMouseLeave={() => setRowHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: row.GAP,
              height: row.HEIGHT,
              // Left-aligned in both states with the avatar centered in the rail, so a toggle never moves it.
              padding: isCollapsed ? `0 0 0 ${SIDEBAR_AVATAR_COLLAPSED_INSET}px` : row.PADDING,
              marginLeft: isCollapsed ? row.COLLAPSED_MARGIN_X : row.MARGIN_LEFT,
              marginRight: isCollapsed ? row.COLLAPSED_MARGIN_X : row.MARGIN_RIGHT,
              border: 'none',
              borderRadius: row.BORDER_RADIUS,
              backgroundColor: rowHovered ? DEFAULT_COLORS.HOVER_BG : 'transparent',
              cursor: 'pointer',
              transition: `${row.TRANSITION}, ${SIDEBAR_LAYOUT.PADDING_TRANSITION}`,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <div style={avatarRingStyle(SIDEBAR_USER_MENU.AVATAR.SIZE)}>
              <UserAvatarComponent
                avatar={currentUser.avatar}
                username={currentUser.username}
                size={SIDEBAR_USER_MENU.AVATAR.SIZE}
                style={{ border: 'none' }}
              />
            </div>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: row.GAP,
                flex: 1,
                minWidth: 0,
                ...getSidebarLabelFade(isCollapsed),
              }}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  textAlign: 'left',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: SIDEBAR_USER_MENU.USERNAME.FONT_SIZE,
                  fontWeight: SIDEBAR_USER_MENU.USERNAME.FONT_WEIGHT,
                  color: DEFAULT_COLORS.TEXT_PRIMARY,
                }}
              >
                {currentUser.username || SIDEBAR_USER_MENU.FALLBACK_USERNAME}
              </span>
              <HiChevronUpDown
                style={{
                  fontSize: SIDEBAR_USER_MENU.CHEVRON.SIZE,
                  color: DEFAULT_COLORS.TEXT_MUTED,
                  flexShrink: 0,
                }}
              />
            </span>
          </button>
        ) : (
          <div>
            <UserAvatar currentUser={currentUser} size={HEADER_CONSTANTS.USER.AVATAR.SIZE} />
          </div>
        )}
      </Dropdown>
    );
  },
);

UserAvatarDropdown.displayName = 'UserAvatarDropdown';

export default UserAvatarDropdown;
