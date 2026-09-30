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

  const field = (
    <Form.Item
      label={label}
      name={name}
      rules={combinedRules}
      required={required}
      style={{ marginBottom }}
      className={`form-item-compact no-asterisk ${className || ''}`}
      normalize={normalize}
      validateTrigger={validateTrigger}
    >
      <Input placeholder={placeholder} allowClear={allowClear} disabled={disabled} />
    </Form.Item>
  );

  // The tooltip explains a locked input, so it covers the input, not only the label.
  return tooltip ? (
    <Tooltip title={tooltip}>
      <div>{field}</div>
    </Tooltip>
  ) : (
    field
  );
};

export default LabeledInput;
