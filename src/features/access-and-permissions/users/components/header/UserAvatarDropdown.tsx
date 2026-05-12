import React, { useState, useEffect, memo } from 'react';
import { Dropdown, App as AntdApp } from 'antd';
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
import { APP_ROUTES, HEADER_CONSTANTS } from '../../../../../constants';
import { isDevelopment } from '../../../../../utils/helpers/env';
import type { User } from '../../models';
import logger from '../../../../../logging';

const UserAvatarDropdown: React.FC = memo(() => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [loggingOut, setLoggingOut] = useState(false);
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

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement={HEADER_CONSTANTS.USER.MENU.PLACEMENT}
      trigger={['click']}
      styles={{ root: { minWidth: HEADER_CONSTANTS.USER.MENU.MIN_WIDTH } }}
    >
      <div>
        <UserAvatar
          currentUser={currentUser}
          size={HEADER_CONSTANTS.USER.AVATAR.SIZE}
          borderWidth={HEADER_CONSTANTS.USER.AVATAR.BORDER_WIDTH}
        />
      </div>
    </Dropdown>
  );
});

UserAvatarDropdown.displayName = 'UserAvatarDropdown';

export default UserAvatarDropdown;
