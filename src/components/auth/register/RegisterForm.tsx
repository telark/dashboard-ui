import React from 'react';
import { Form, Input, Button, FormInstance } from 'antd';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { AUTH_ERROR_MESSAGES } from '../../../constants/auth';
import { DEFAULT_COLORS } from '../../../constants';
import { REGISTER_CONSTANTS } from '../../../constants/pages/register';
import { AuthForm } from '../shared/AuthForm';

interface RegisterFormProps {
  form: FormInstance;
  loading: boolean;
  onFinish: (values: { username: string; deviceName: string }) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ form, loading, onFinish }) => {
  return (
    <AuthForm form={form} onFinish={onFinish}>
      <Form.Item
        label={REGISTER_CONSTANTS.UI.USERNAME_LABEL}
        name="username"
        rules={[{ required: true, message: AUTH_ERROR_MESSAGES.MISSING_USERNAME }]}
        style={{ marginBottom: '24px' }}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#999' }} />}
          placeholder={REGISTER_CONSTANTS.UI.USERNAME_PLACEHOLDER}
          style={{
            height: '48px',
            borderRadius: '8px',
            fontSize: '15px',
          }}
        />
      </Form.Item>

      <Form.Item
        label={REGISTER_CONSTANTS.UI.DEVICE_NAME_LABEL}
        name="deviceName"
        rules={[{ required: true, message: AUTH_ERROR_MESSAGES.MISSING_DEVICE_NAME }]}
        style={{ marginBottom: '24px' }}
      >
        <Input
          placeholder={REGISTER_CONSTANTS.UI.DEVICE_NAME_PLACEHOLDER}
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
          icon={<UserAddOutlined />}
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
          {loading ? REGISTER_CONSTANTS.UI.BUTTON_LOADING : REGISTER_CONSTANTS.UI.BUTTON_TEXT}
        </Button>
      </Form.Item>
    </AuthForm>
  );
};
