import React from 'react';
import { Form, Input, Button, FormInstance } from 'antd';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';
import { AUTH_ERROR_MESSAGES } from '../../../constants/auth';
import { DEFAULT_COLORS } from '../../../constants';
import { LOGIN_CONSTANTS } from '../../../constants/pages/login';
import { AuthForm } from '../shared/AuthForm';

interface LoginFormProps {
  form: FormInstance;
  loading: boolean;
  onFinish: (values: { username: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ form, loading, onFinish }) => {
  return (
    <AuthForm form={form} onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: AUTH_ERROR_MESSAGES.MISSING_USERNAME }]}
        style={{ marginBottom: '24px' }}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#999' }} />}
          placeholder={LOGIN_CONSTANTS.UI.USERNAME_PLACEHOLDER}
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
          {loading ? LOGIN_CONSTANTS.UI.BUTTON_LOADING : LOGIN_CONSTANTS.UI.BUTTON_TEXT}
        </Button>
      </Form.Item>
    </AuthForm>
  );
};
