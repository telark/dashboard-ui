import type { ReactNode } from 'react';
import type { FormInstance } from 'antd';

export interface EditField {
  key: string;
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'select' | 'textarea' | 'custom';
  options?: Array<{ label: string; value: string | number }>;
  component?: ReactNode;
  rules?: any[];
}

export interface EditSection {
  key: string;
  title: string;
  subtitle?: string;
  fields: EditField[];
}

export interface EditConfig {
  sections: EditSection[];
  initialValues?: Record<string, any>;
  submitButtonText?: string;
  submitButtonIcon?: ReactNode;
}

export interface EditFormProps {
  form: FormInstance;
  config: EditConfig;
  onSubmit: (values: any) => Promise<void> | void;
  isSubmitting?: boolean;
}
