import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { registerStart, createPasskey } from '../../clients/auth';
import { registerPasskey } from '../../utils/auth/webauthn';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES, AUTH_INFO_MESSAGES } from '../../constants/auth';
import { APP_ROUTES } from '../../constants';

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values: { username: string; deviceName: string }) => {
    setLoading(true);
    try {
      // Step 1: Start registration - get challenge and options
      // For first-time registration, send username (no session required)
      const registerStartResponse = await registerStart(values.username);

      // Extract options from nested structure if needed
      const options = registerStartResponse.options?.response || registerStartResponse;

      // Step 2: Create passkey with WebAuthn
      const credential = await registerPasskey({
        challenge: options.challenge!,
        rp: options.rp!,
        user: options.user!,
        pubKeyCredParams: options.pubKeyCredParams!,
        timeout: options.timeout,
        attestation: options.attestation,
        authenticatorSelection: options.authenticatorSelection,
      });

      // Step 3: Create passkey - verify attestation and store
      // Determine device type based on authenticator attachment
      // For now, default to 'platform' - this could be enhanced to detect actual type
      const deviceType: 'platform' | 'cross-platform' = 'platform';
      await createPasskey(
        { credential },
        values.deviceName,
        deviceType,
        values.username, // Pass username for unauthenticated registration
      );

      message.success(AUTH_SUCCESS_MESSAGES.REGISTER_SUCCESS);
      navigate(APP_ROUTES.LOGIN);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.REGISTER_FINISH_FAILED;
      message.error(errorMessage);
      console.error('Registration error:', error);
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
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Register Passkey</h1>
        <Form form={form} layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: AUTH_ERROR_MESSAGES.MISSING_USERNAME },
            ]}
          >
            <Input placeholder="Enter your username" size="large" />
          </Form.Item>
          <Form.Item
            label="Device Name"
            name="deviceName"
            rules={[
              { required: true, message: AUTH_ERROR_MESSAGES.MISSING_DEVICE_NAME },
            ]}
          >
            <Input placeholder="e.g. My Laptop, iPhone 13" size="large" />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
            <PrimaryButton
              action="Register Passkey"
              loading={loading}
              loadingLabel={AUTH_INFO_MESSAGES.REGISTERING}
              onClick={() => form.submit()}
              icon={<UserAddOutlined />}
            />
          </Form.Item>
        </Form>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a onClick={() => navigate(APP_ROUTES.LOGIN)} style={{ cursor: 'pointer' }}>
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;

