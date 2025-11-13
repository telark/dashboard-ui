import React from 'react';
import { Form, FormInstance } from 'antd';

interface AuthFormProps {
  form: FormInstance;
  onFinish: (values: any) => void;
  children: React.ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({ form, onFinish, children }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} size="large">
      {children}
    </Form>
  );
};

