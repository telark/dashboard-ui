import type React from 'react';

export interface FormFieldConfig {
  type: 'input' | 'select' | 'textarea';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  marginBottom?: number;
  rules?: any[];
}

export interface FormFieldRendererProps {
  field: FormFieldConfig;
}

export interface BaseModalProps {
  open: boolean;
  onCancel: () => void;
  width?: number;
  children: React.ReactNode;
  centered?: boolean;
  styles?: {
    body?: React.CSSProperties;
    content?: React.CSSProperties;
  };
}

export interface FormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (values: Record<string, any>) => void | Promise<void>;
  title: string;
  subtitle?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  fields?: FormFieldConfig[];
  customContent?: React.ReactNode | ((form: any) => React.ReactNode);
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  width?: number;
  initialValues?: Record<string, any>;
  loading?: boolean;
  buttonWrapperStyle?: React.CSSProperties;
  contentWrapperStyle?: React.CSSProperties;
}

