import React, { useState, useEffect, memo } from 'react';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, handleUserLogout, hasSessionToken } from '../../../../auth/utils';
import { fetchCurrentUserDetails } from '../../utils';
import { createUserMenuItems } from './UserMenuItems';
import UserAvatar from './UserAvatar';
import { HEADER_CONSTANTS } from '../../../../../constants';
import { isDevelopment } from '../../../../../utils/helpers/env';
import type { User } from '../../models';
import logger from '../../../../../logging';

const UserAvatarDropdown: React.FC = memo(() => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentAuthUser = getCurrentUser();

    if (hasSessionToken() && !currentAuthUser) {
      if (isDevelopment()) {
        logger.warn(HEADER_CONSTANTS.USER.WARNINGS.MISSING_USER_DATA);
      }
    }

    if (currentAuthUser) {
      // Set the user immediately for display
      setCurrentUser(currentAuthUser);

      // Fetch full user details if we have an id
      if (currentAuthUser.id) {
        fetchCurrentUserDetails((user) => {
          setCurrentUser(user);
        });
      }
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await handleUserLogout(navigate);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogoutWrapper = () => {
    void handleLogout();
  };

  const menuItems = createUserMenuItems({
    currentUser,
    onLogout: handleLogoutWrapper,
    loggingOut,
  });

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement={HEADER_CONSTANTS.USER.MENU.PLACEMENT}
      trigger={['click']}
      overlayStyle={{ minWidth: HEADER_CONSTANTS.USER.MENU.MIN_WIDTH }}
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
