import React from 'react';
import { Form, Select } from 'antd';
import type { LabeledSelectProps } from '../../interfaces/inputs';

const LabeledSelect: React.FC<LabeledSelectProps> = ({
  name,
  label,
  options,
  placeholder,
  required = false,
  rules = [],
  marginBottom = 6,
  allowClear = false,
  mode,
}) => {
  const combinedRules = required
    ? [{ required: true, message: `Please select ${label.toLowerCase()}` }, ...rules]
    : rules;

  return (
    <Form.Item label={label} name={name} rules={combinedRules} style={{ marginBottom }}>
      <Select options={options} placeholder={placeholder} allowClear={allowClear} mode={mode} />
    </Form.Item>
  );
};

export default LabeledSelect;


