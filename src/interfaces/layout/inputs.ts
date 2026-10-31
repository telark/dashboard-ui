import type { Rule } from 'antd/es/form';

export interface LabeledInputProps {
  name: string;
  label: string;
  maxLength: number;
  placeholder?: string;
  required?: boolean;
  rules?: Rule[];
  marginBottom?: number;
  allowClear?: boolean;
  className?: string;
  normalize?: (value: string) => string;
  validateTrigger?: string | string[];
  tooltip?: string;
  disabled?: boolean;
}
