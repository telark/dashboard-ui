import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { loginStart, loginFinish } from '../../clients/auth';
import { authenticateWithPasskey } from '../../utils/auth/webauthn';
import { setSessionToken } from '../../utils/auth/session';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES, AUTH_INFO_MESSAGES } from '../../constants/auth';
import { APP_ROUTES } from '../../constants';
import type { AuthenticatorAssertionResponse } from '../../interfaces/auth';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { username: string }) => {
    setLoading(true);
    try {
      // Step 1: Start login - get challenge and options
      const loginStartResponse = await loginStart({ username: values.username });

      // Extract options from nested structure if needed
      const options = loginStartResponse.options?.response || loginStartResponse;

      // Step 2: Authenticate with WebAuthn
      const credential = await authenticateWithPasskey({
        challenge: options.challenge!,
        timeout: options.timeout,
        rpId: options.rpId,
        allowCredentials: options.allowCredentials,
        userVerification: 'preferred',
      });

      // Step 3: Finish login - verify credential and get session
      // Convert credential to the format expected by backend
      const loginFinishResponse = await loginFinish({
        username: values.username,
        response: {
          id: credential.id,
          rawId: credential.rawId,
          response: credential.response as AuthenticatorAssertionResponse,
          type: credential.type,
        },
      });

      // Step 4: Store session token
      setSessionToken(loginFinishResponse.sessionToken);

      message.success(AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS);
      navigate('/');
    } catch (error: any) {
      // Check if error is about no passkeys
      if (error?.response?.status === 404 || error?.status === 404) {
        const errorMsg = error?.response?.data?.message || error?.message || '';
        if (errorMsg.includes('no passkeys') || errorMsg.includes('No passkeys')) {
          const errorMessage = 'No passkeys found. Please register a passkey first.';
          message.error(errorMessage);
          setTimeout(() => {
            navigate(APP_ROUTES.REGISTER);
          }, 2000);
          return;
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.LOGIN_FINISH_FAILED;
      message.error(errorMessage);
      console.error('Login error:', error);
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
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '48px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Login</h1>
        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: AUTH_ERROR_MESSAGES.MISSING_USERNAME },
            ]}
          >
            <Input placeholder="Enter your username" size="large" />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
            <PrimaryButton
              action="Login with Passkey"
              loading={loading}
              loadingLabel={AUTH_INFO_MESSAGES.LOGGING_IN}
              onClick={() => form.submit()}
              icon={<LoginOutlined />}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

