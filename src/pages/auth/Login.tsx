import React, { useState } from 'react';
import { Form, Input, Button, App as AntdApp } from 'antd';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { performLogin } from '../../utils/auth/login';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth';
import { APP_ROUTES, DEFAULT_COLORS } from '../../constants';

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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#ffffff',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '420px',
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: DEFAULT_COLORS.SUCCESS,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <LoginOutlined style={{ fontSize: '32px', color: '#ffffff' }} />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 600,
              color: '#1a1a1a',
              letterSpacing: '-0.5px',
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: '14px',
              color: '#666',
            }}
          >
            Sign in with your passkey
          </p>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: AUTH_ERROR_MESSAGES.MISSING_USERNAME }]}
            style={{ marginBottom: '24px' }}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#999' }} />}
              placeholder="Enter your username"
              style={{
                height: '48px',
                borderRadius: '8px',
                fontSize: '15px',
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              icon={<LoginOutlined />}
              style={{
                height: '48px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 500,
                background: DEFAULT_COLORS.SUCCESS,
                border: 'none',
                boxShadow: '0 4px 12px rgba(32, 201, 151, 0.3)',
              }}
            >
              {loading ? 'Authenticating...' : 'Login with Passkey'}
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#999',
          }}
        >
          Don't have a passkey?{' '}
          <a
            href={APP_ROUTES.REGISTER}
            style={{
              color: DEFAULT_COLORS.SUCCESS,
              textDecoration: 'none',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Register now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
