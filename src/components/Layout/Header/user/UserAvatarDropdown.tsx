import React, { useState, useEffect } from 'react';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAuthUser, fetchCurrentUserDetails, handleUserLogout } from '../../../../utils/user/userUtils';
import { createUserMenuItems } from './UserMenuItems';
import UserAvatar from './UserAvatar';
import { HEADER_CONSTANTS } from '../../../../constants';
import type { User as AuthUser } from '../../../../interfaces/auth';
import type { User as UsersUser } from '../../../../interfaces/users';

interface UserAvatarDropdownProps {}

const UserAvatarDropdown: React.FC<UserAvatarDropdownProps> = () => {
  const [currentAuthUser, setCurrentAuthUser] = useState<AuthUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UsersUser | null>(null);
  const [, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = getAuthUser();
    setCurrentAuthUser(authUser);

    if (authUser?.id) {
      setLoading(true);
      fetchCurrentUserDetails(
        (user) => {
          setCurrentUser(user);
        },
        () => {
          // Error handling is done in fetchCurrentUserDetails
        },
      ).finally(() => {
        setLoading(false);
      });
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

  const menuItems = createUserMenuItems({
    currentUser,
    currentAuthUser,
    onLogout: handleLogout,
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
          currentAuthUser={currentAuthUser}
          size={HEADER_CONSTANTS.USER.AVATAR.SIZE}
          borderWidth={HEADER_CONSTANTS.USER.AVATAR.BORDER_WIDTH}
        />
      </div>
    </Dropdown>
  );
};

export default UserAvatarDropdown;

