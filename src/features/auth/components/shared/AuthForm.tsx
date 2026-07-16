import React from 'react';
import { Form, FormInstance } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';

interface AuthFormProps {
  form: FormInstance;
  onFinish: (values: any) => void;
  children: React.ReactNode;
}

const requiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {label}
    {required && <span style={{ color: DEFAULT_COLORS.DANGER, marginLeft: 4 }}>*</span>}
  </>
);

export const AuthForm: React.FC<AuthFormProps> = ({ form, onFinish, children }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={requiredMark}>
      {children}
    </Form>
  );
};
