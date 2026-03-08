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
      required={required}
      style={{ marginBottom }}
      className={`form-item-compact no-asterisk ${className || ''}`}
      normalize={normalize}
      validateTrigger={validateTrigger}
    >
      <Input
        size="small"
        placeholder={placeholder}
        allowClear={allowClear}
        disabled={disabled}
        style={{
          height: 36,
          borderRadius: 8,
          border: '1px solid #d9d9d9',
          fontSize: 14,
        }}
      />
    </Form.Item>
  );
};

export default LabeledInput;
