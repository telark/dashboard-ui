import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar, message } from 'antd';
import type { MenuProps } from 'antd';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../clients/auth';
import { removeSessionToken } from '../../../utils/auth/session';
import { getCurrentUser } from '../../../utils/auth/user';
import { fetchUserById } from '../../../clients/exporter';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../../constants/auth';
import { APP_ROUTES, DEFAULT_COLORS } from '../../../constants';
import UserAvatar from '../../display/shared/avatars/UserAvatar';
import type { User as AuthUser } from '../../../interfaces/auth';
import type { User as UsersUser } from '../../../interfaces/users';

interface UserAvatarDropdownProps {}

const UserAvatarDropdown: React.FC<UserAvatarDropdownProps> = () => {
  const [currentAuthUser, setCurrentAuthUser] = useState<AuthUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UsersUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = getCurrentUser();
    setCurrentAuthUser(authUser);
    
    // Fetch user details by ID to get avatar data
    if (authUser?.id) {
      setLoading(true);
      fetchUserById(authUser.id, true)
        .then((response) => {
          if (response.data) {
            setCurrentUser(response.data);
          }
        })
        .catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to fetch user details:', error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      try {
        removeSessionToken();
      } catch {
        // Ignore session removal errors during successful logout
      }
      message.success(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS);
      navigate(APP_ROUTES.LOGIN);
    } catch (error) {
      try {
        removeSessionToken();
      } catch {
        // Even if session removal fails, proceed with logout
      }
      message.error(AUTH_ERROR_MESSAGES.LOGOUT_FAILED);
      navigate(APP_ROUTES.LOGIN);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSettings = () => {
    // Placeholder for settings functionality
    message.info('Settings feature coming soon');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontWeight: 500, fontSize: '14px', color: '#0B1F33' }}>
            {currentUser?.username || currentAuthUser?.username || 'User'}
          </div>
          {(currentUser?.email || currentAuthUser?.email) && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {currentUser?.email || currentAuthUser?.email}
            </div>
          )}
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingOutlined />
          <span>Settings</span>
        </div>
      ),
      onClick: handleSettings,
    },
    {
      key: 'logout',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: DEFAULT_COLORS.SUCCESS }}>
          <LogoutOutlined style={{ color: DEFAULT_COLORS.SUCCESS }} />
          <span style={{ color: DEFAULT_COLORS.SUCCESS }}>Logout</span>
        </div>
      ),
      onClick: handleLogout,
      disabled: loggingOut,
    },
  ];

  // Match the size of Ant Design small circle button (24px)
  // Avatar is 24px, with 2px border on each side = 28px total
  const avatarSize = 22;
  const borderWidth = 1.5;

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={['click']}
      overlayStyle={{ minWidth: '200px' }}
    >
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: avatarSize + borderWidth * 2,
          height: avatarSize + borderWidth * 2,
          borderRadius: '50%',
          border: `${borderWidth}px solid ${DEFAULT_COLORS.SUCCESS}`,
          padding: borderWidth,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {currentUser ? (
          <UserAvatar
            avatar={currentUser.avatar}
            username={currentUser.username}
            size={avatarSize}
            style={{ border: 'none' }}
          />
        ) : currentAuthUser ? (
          <UserAvatar
            username={currentAuthUser.username}
            size={avatarSize}
            style={{ border: 'none' }}
          />
        ) : (
          <Avatar size={avatarSize} style={{ backgroundColor: DEFAULT_COLORS.SUCCESS }}>
            {'U'}
          </Avatar>
        )}
      </div>
    </Dropdown>
  );
};

export default UserAvatarDropdown;

