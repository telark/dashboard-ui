import React from 'react';
import { Form, Select } from 'antd';
import type { LabeledSelectProps } from '../../../../interfaces/layout/inputs';

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
  className,
}) => {
  const combinedRules = required
    ? [{ required: true, message: `Please select ${label.toLowerCase()}` }, ...rules]
    : rules;

  return (
    <Form.Item
      label={label}
      name={name}
      rules={combinedRules}
      style={{ marginBottom }}
      className={`form-item-compact ${className || ''}`}
    >
      <Select options={options} placeholder={placeholder} allowClear={allowClear} mode={mode} />
    </Form.Item>
  );
};

export default LabeledSelect;
