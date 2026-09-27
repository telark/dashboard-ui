import React from 'react';
import { Form, Input, Button, Alert, FormInstance } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { AuthForm } from '../shared/AuthForm';
import { DEFAULT_COLORS } from '../../../../constants';

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
          borderColor: `var(--auth-card-border, ${DEFAULT_COLORS.AUTH_LIGHT_BORDER})`,
          background: `var(--auth-input-bg, ${DEFAULT_COLORS.AUTH_LIGHT_CARD_BG})`,
          color: `var(--auth-text-primary, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT})`,
        }}
      />
    </Form.Item>

    <Form.Item style={{ marginBottom: 0 }}>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        block
        style={{
          fontWeight: 600,
          background: 'var(--color-primary)',
          borderColor: 'var(--color-primary)',
          color: DEFAULT_COLORS.PILL_TEXT,
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
          color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
          margin: '8px 0 0',
        }}
      >
        Waiting for your authenticator…
      </p>
    )}

    {error && (
      <Alert
        title={error}
        type="error"
        showIcon
        closable={{ onClose: onClearError }}
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
