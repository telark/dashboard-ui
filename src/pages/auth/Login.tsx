import React, { useState } from 'react';
import { Form, App as AntdApp } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { performLogin } from '../../utils/auth/login';
import { APP_ROUTES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/pages/login';
import { LoginForm } from '../../components/auth/login';
import { AuthContainer, AuthCard, AuthHeader, AuthFooter } from '../../components/auth/shared';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const handleLogin = async (values: { username: string }) => {
    setLoading(true);
    try {
      await performLogin(
        values.username,
        message,
        () => navigate(APP_ROUTES.HOME),
        () => navigate(APP_ROUTES.REGISTER),
      );
    } catch {
      // Error handling is done in performLogin
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader
          icon={<LoginOutlined style={{ fontSize: '32px', color: '#ffffff' }} />}
          title={LOGIN_CONSTANTS.UI.TITLE}
          subtitle={LOGIN_CONSTANTS.UI.SUBTITLE}
        />
        <LoginForm form={form} loading={loading} onFinish={handleLogin} />
        <AuthFooter
          text={LOGIN_CONSTANTS.UI.FOOTER_TEXT}
          linkText={LOGIN_CONSTANTS.UI.FOOTER_LINK}
          onLinkClick={() => navigate(APP_ROUTES.REGISTER)}
        />
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;
