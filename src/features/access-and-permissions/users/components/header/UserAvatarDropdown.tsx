import React, { useState, useEffect, memo } from 'react';
import { Dropdown, App as AntdApp } from 'antd';
import { HiChevronUpDown } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  CURRENT_USER_UPDATED_EVENT,
  handleUserLogout,
  hasSessionToken,
  validateSession,
} from '../../../../auth/utils';
import { fetchCurrentUserDetails } from '../../utils';
import { fetchUserById } from '../../clients/fetch';
import { createUserMenuItems } from './UserMenuItems';
import UserAvatar from './UserAvatar';
import UserAvatarComponent from '../../../../../components/display/avatars/UserAvatar';
import { avatarRingStyle } from '../../../../../components/display/avatars/avatarRing';
import {
  APP_ROUTES,
  BUTTON_CONFIGS,
  DEFAULT_COLORS,
  HEADER_CONSTANTS,
  SIDEBAR_USER_MENU,
} from '../../../../../constants';
import { isDevelopment } from '../../../../../utils/helpers/env';
import type { User } from '../../models';
import logger from '../../../../../logging';

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

    useEffect(() => {
      const initialUser = getCurrentUser();

      if (hasSessionToken() && !initialUser) {
        if (isDevelopment()) {
          logger.warn(HEADER_CONSTANTS.USER.WARNINGS.MISSING_USER_DATA);
        }
        // Self-heal: token exists but user not in localStorage (e.g. after OIDC login)
        validateSession()
          .then((result) => {
            if (result.isValid && result.sessionDetails?.userId) {
              return fetchUserById(result.sessionDetails.userId, true).then((res) => {
                if (res?.data) setCurrentUser(res.data);
              });
            }
          })
          .catch(() => {});
      } else if (initialUser?.id) {
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
      currentUser,
      onLogout: handleLogoutWrapper,
      onSettings: () => navigate(`${APP_ROUTES.SETTINGS}/profile`),
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
        styles={{ root: { minWidth: HEADER_CONSTANTS.USER.MENU.MIN_WIDTH } }}
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
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: row.GAP,
              height: row.HEIGHT,
              padding: isCollapsed ? 0 : row.PADDING,
              marginLeft: isCollapsed ? row.COLLAPSED_MARGIN_X : row.MARGIN_LEFT,
              marginRight: isCollapsed ? row.COLLAPSED_MARGIN_X : row.MARGIN_RIGHT,
              border: 'none',
              borderRadius: row.BORDER_RADIUS,
              backgroundColor: rowHovered ? DEFAULT_COLORS.BACKGROUND_HOVER : 'transparent',
              cursor: 'pointer',
              transition: row.TRANSITION,
              boxSizing: 'border-box',
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
            {!isCollapsed && (
              <>
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
              </>
            )}
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
