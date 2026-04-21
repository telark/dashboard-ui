import React from 'react';
import { Form, Input, Button, FormInstance } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { DEFAULT_COLORS } from '../../../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
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
        style={{ marginBottom: '16px' }}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
          placeholder={LOGIN_CONSTANTS.UI.USERNAME_PLACEHOLDER}
          style={{
            height: '44px',
            borderRadius: '10px',
            fontSize: '15px',
            borderColor: '#e2e8f0',
          }}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          htmlType="submit"
          loading={loading}
          block
          icon={<KeyOutlined />}
          size="large"
          style={{
            height: '44px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            color: DEFAULT_COLORS.SUCCESS,
            borderColor: DEFAULT_COLORS.SUCCESS,
            background: 'transparent',
          }}
        >
          {loading ? LOGIN_CONSTANTS.UI.BUTTON_LOADING : LOGIN_CONSTANTS.UI.BUTTON_TEXT}
        </Button>
      </Form.Item>
    </AuthForm>
  );
};
