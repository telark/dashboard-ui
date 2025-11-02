import React from 'react';
import { Form, Input } from 'antd';
import type { LabeledInputProps } from '../../interfaces/inputs';


const LabeledInput: React.FC<LabeledInputProps> = ({
  name,
  label,
  placeholder,
  required = false,
  rules = [],
  marginBottom = 6,
  allowClear = true,
}) => {
  const combinedRules = required
    ? [{ required: true, message: `Please enter ${label.toLowerCase()}` }, ...rules]
    : rules;

  return (
    <Form.Item label={label} name={name} rules={combinedRules} style={{ marginBottom }}>
      <Input placeholder={placeholder} allowClear={allowClear} />
    </Form.Item>
  );
};

export default LabeledInput;


