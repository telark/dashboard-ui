import React from 'react';
import { Form, Input, Button, Alert, FormInstance } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { AuthForm } from '../shared/AuthForm';

interface LoginFormProps {
  form: FormInstance;
  loading: boolean;
  onFinish: (values: { email: string }) => void;
  error?: string | null;
  onClearError?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  form,
  loading,
  onFinish,
  error,
  onClearError,
}) => (
  <AuthForm form={form} onFinish={onFinish}>
    <Form.Item
      name="email"
      rules={[
        { required: true, message: AUTH_ERROR_MESSAGES.MISSING_EMAIL },
        { type: 'email', message: 'Please enter a valid email address' },
      ]}
      style={{ marginBottom: '12px' }}
    >
      <Input
        type="email"
        placeholder={LOGIN_CONSTANTS.UI.EMAIL_PLACEHOLDER}
        autoFocus
        style={{
          height: '44px',
          borderRadius: '10px',
          fontSize: '15px',
          borderColor: 'var(--auth-card-border, #e2e8f0)',
          background: 'var(--auth-input-bg, #ffffff)',
          color: 'var(--auth-text-primary, #0B1F33)',
        }}
      />
    </Form.Item>

    <Form.Item style={{ marginBottom: 0 }}>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        block
        size="large"
        style={{
          height: '44px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 600,
          background: 'var(--color-primary, #1e293b)',
          borderColor: 'var(--color-primary, #1e293b)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        icon={!loading ? <KeyOutlined /> : undefined}
      >
        {loading ? LOGIN_CONSTANTS.UI.BUTTON_LOADING : 'Authenticate'}
      </Button>
    </Form.Item>

    {loading && (
      <p
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--auth-text-muted, #64748b)',
          margin: '8px 0 0',
        }}
      >
        Waiting for your authenticator…
      </p>
    )}

    {error && (
      <Alert
        message={error}
        type="error"
        showIcon
        closable
        onClose={onClearError}
        style={{
          marginTop: '10px',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '13px',
        }}
      />
    )}
  </AuthForm>
);
