import type React from 'react';
import type { Rule } from 'antd/es/form';

export interface FormFieldConfig {
  type: 'input' | 'select' | 'textarea';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  marginBottom?: number;
  rules?: Rule[];
}

export interface BaseModalProps {
  open: boolean;
  onCancel: () => void;
  width?: number;
  children: React.ReactNode;
  centered?: boolean;
  showCloseIcon?: boolean;
  styles?: {
    body?: React.CSSProperties;
    content?: React.CSSProperties;
  };
}
