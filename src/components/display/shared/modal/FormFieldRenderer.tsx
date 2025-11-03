import React from 'react';
import { Form, Input } from 'antd';
import LabeledInput from '../../../shared/LabeledInput';
import LabeledSelect from '../../../shared/LabeledSelect';

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

interface FormFieldRendererProps {
  field: FormFieldConfig;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({ field }) => {
  const commonProps = {
    name: field.name,
    label: field.label,
    required: field.required,
    marginBottom: field.marginBottom ?? 18,
    rules: field.rules,
  };

  switch (field.type) {
    case 'input':
      return (
        <LabeledInput
          {...commonProps}
          placeholder={field.placeholder}
        />
      );
    case 'select':
      return (
        <LabeledSelect
          {...commonProps}
          placeholder={field.placeholder}
          options={field.options || []}
        />
      );
    case 'textarea':
      return (
        <Form.Item
          label={field.label}
          name={field.name}
          rules={
            field.required
              ? [{ required: true, message: `Please enter ${field.label.toLowerCase()}` }, ...(field.rules || [])]
              : field.rules
          }
          style={{ marginBottom: field.marginBottom ?? 18 }}
          className="form-item-compact"
        >
          <Input.TextArea placeholder={field.placeholder} rows={3} allowClear />
        </Form.Item>
      );
    default:
      return null;
  }
};

export default FormFieldRenderer;

