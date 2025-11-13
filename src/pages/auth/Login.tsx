import React, { useState } from 'react';
import { Form, App as AntdApp } from 'antd';
import { useNavigate } from 'react-router-dom';
import { performLogin } from '../../utils/auth/login';
import { APP_ROUTES } from '../../constants';
import { LoginContainer, LoginCard, LoginHeader, LoginForm, LoginFooter } from '../../components/auth/login';

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
    <LoginContainer>
      <LoginCard>
        <LoginHeader />
        <LoginForm form={form} loading={loading} onFinish={handleLogin} />
        <LoginFooter />
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
