export interface LabeledInputProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rules?: any[];
  marginBottom?: number;
  allowClear?: boolean;
  className?: string;
  normalize?: (value: string) => string;
  validateTrigger?: string | string[];
  tooltip?: string;
  disabled?: boolean;
}

export interface LabeledSelectProps {
  name: string;
  label: string;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  required?: boolean;
  rules?: any[];
  marginBottom?: number;
  allowClear?: boolean;
  mode?: 'multiple' | 'tags';
  className?: string;
  disabled?: boolean;
  tooltip?: string;
}
