import React from 'react';
import { Form, Input, Button, FormInstance } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { AUTH_ERROR_MESSAGES } from '../../constants';
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
        style={{ marginBottom: '12px' }}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
          placeholder={LOGIN_CONSTANTS.UI.USERNAME_PLACEHOLDER}
          autoFocus
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
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          icon={<KeyOutlined />}
          size="large"
          style={{
            height: '44px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            background: '#1e293b',
            borderColor: '#1e293b',
            color: '#ffffff',
          }}
        >
          {loading ? LOGIN_CONSTANTS.UI.BUTTON_LOADING : 'Authenticate'}
        </Button>
      </Form.Item>
    </AuthForm>
  );
};
