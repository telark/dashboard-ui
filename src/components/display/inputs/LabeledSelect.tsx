import React from 'react';
import { Form, Select, Tooltip } from 'antd';
import type { LabeledSelectProps } from '../../../interfaces/layout/inputs';

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
  disabled = false,
  tooltip,
}) => {
  const combinedRules = required
    ? [{ required: true, message: `Please select ${label.toLowerCase()}` }, ...rules]
    : rules;

  const labelContent = tooltip ? (
    <Tooltip title={tooltip}>
      <span>{label}</span>
    </Tooltip>
  ) : (
    label
  );

  return (
    <Form.Item
      label={labelContent}
      name={name}
      rules={combinedRules}
      style={{ marginBottom }}
      className={`form-item-compact ${className || ''}`}
    >
      <Select
        size="small"
        options={options}
        placeholder={placeholder}
        allowClear={allowClear}
        mode={mode}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default LabeledSelect;
