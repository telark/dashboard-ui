import React from 'react';
import { Form, Input, Tooltip } from 'antd';
import type { LabeledInputProps } from '../../../interfaces/layout/inputs';

const LabeledInput: React.FC<LabeledInputProps> = ({
  name,
  label,
  placeholder,
  required = false,
  rules = [],
  marginBottom = 6,
  allowClear = true,
  className,
  normalize,
  validateTrigger,
  tooltip,
  disabled = false,
}) => {
  const combinedRules = required
    ? [{ required: true, message: `Please enter ${label.toLowerCase()}` }, ...rules]
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
      normalize={normalize}
      validateTrigger={validateTrigger}
    >
      <Input size="small" placeholder={placeholder} allowClear={allowClear} disabled={disabled} />
    </Form.Item>
  );
};

export default LabeledInput;
