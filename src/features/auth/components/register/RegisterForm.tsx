import React from 'react';
import { Form, Input, Button, FormInstance } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { REGISTER_CONSTANTS } from '../../constants/register';
import { AuthForm } from '../shared/AuthForm';
import { DEFAULT_COLORS } from '../../../../constants';

interface RegisterFormProps {
  form: FormInstance;
  loading: boolean;
  onFinish: (values: { email: string; deviceName: string }) => void;
  disabled?: boolean;
}

const inputStyle: React.CSSProperties = {
  borderColor: `var(--auth-card-border, ${DEFAULT_COLORS.AUTH_LIGHT_BORDER})`,
  background: `var(--auth-input-bg, ${DEFAULT_COLORS.AUTH_LIGHT_CARD_BG})`,
  color: `var(--auth-text-primary, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT})`,
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  form,
  loading,
  onFinish,
  disabled,
}) => (
  <AuthForm form={form} onFinish={onFinish}>
    <Form.Item
      name="email"
      label={REGISTER_CONSTANTS.UI.EMAIL_LABEL}
      rules={[
        { required: true, message: AUTH_ERROR_MESSAGES.MISSING_EMAIL },
        { type: 'email', message: 'Please enter a valid email address' },
      ]}
      style={{ marginBottom: '12px' }}
    >
      <Input
        type="email"
        placeholder={REGISTER_CONSTANTS.UI.EMAIL_PLACEHOLDER}
        style={inputStyle}
      />
    </Form.Item>

    <Form.Item
      name="deviceName"
      label={REGISTER_CONSTANTS.UI.DEVICE_NAME_LABEL}
      rules={[{ required: true, message: AUTH_ERROR_MESSAGES.MISSING_DEVICE_NAME }]}
      style={{ marginBottom: '16px' }}
    >
      <Input placeholder={REGISTER_CONSTANTS.UI.DEVICE_NAME_PLACEHOLDER} style={inputStyle} />
    </Form.Item>

    <Form.Item style={{ marginBottom: 0 }}>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        disabled={disabled}
        block
        icon={<UserAddOutlined />}
        style={{
          fontWeight: 600,
          background: 'var(--color-primary)',
          borderColor: 'var(--color-primary)',
          color: DEFAULT_COLORS.PILL_TEXT,
        }}
      >
        {loading ? REGISTER_CONSTANTS.UI.BUTTON_LOADING : REGISTER_CONSTANTS.UI.BUTTON_TEXT}
      </Button>
    </Form.Item>
  </AuthForm>
);
