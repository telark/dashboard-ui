import React, { useState } from 'react';
import { Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SettingOutlined, InfoCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../../../clients/auth';
import { removeSessionToken } from '../../../utils/auth/session';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../../constants/auth';
import { APP_ROUTES } from '../../../constants';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

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

  return (
    <div
      style={{
        width: '100%', // Full screen width
        backgroundColor: 'white',
        height: '60px',
        display: 'flex',
        justifyContent: 'flex-end', // Align icons to the right
        alignItems: 'center',
        padding: '10px',
        position: 'fixed',
        left: '0', // Start from the left edge
        top: '0',
        zIndex: 1000,
        transition: 'width 0.3s ease',
      }}
    >
      {/* Action Buttons */}
      <Space size="middle">
        <Button
          icon={<SettingOutlined />}
          shape="circle"
          size="small"
          type="text" // Use "text" type for the ghost-like effect
        />
        <Button icon={<InfoCircleOutlined />} shape="circle" size="small" type="text" />
        <Button
          icon={<LogoutOutlined />}
          shape="circle"
          size="small"
          type="text"
          onClick={handleLogout}
          loading={loggingOut}
          title="Logout"
        />
      </Space>
    </div>
  );
};

export default Header;
