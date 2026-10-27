import React from 'react';
import { Form, FormInstance } from 'antd';
import { DEFAULT_COLORS, SPACING } from '../../../../constants';

interface AuthFormProps<T> {
  form: FormInstance<T>;
  onFinish: (values: T) => void;
  children: React.ReactNode;
}

const requiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {label}
    {required && <span style={{ color: DEFAULT_COLORS.DANGER, marginLeft: SPACING.XS }}>*</span>}
  </>
);

export const AuthForm = <T,>({ form, onFinish, children }: AuthFormProps<T>) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={requiredMark}>
      {children}
    </Form>
  );
};
