import React from 'react';
import { Form, Input, Tooltip } from 'antd';
import type { LabeledInputProps } from '../../../interfaces/layout/inputs';
import { inputGuard } from '../../../utils/helpers/inputGuard';

const LabeledInput: React.FC<LabeledInputProps> = ({
  name,
  label,
  maxLength,
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
  const guard = inputGuard(maxLength, {
    required: required ? `Please enter ${label.toLowerCase()}` : undefined,
  });

  const field = (
    <Form.Item
      label={label}
      name={name}
      rules={[...guard.rules, ...rules]}
      required={required}
      style={{ marginBottom }}
      className={`form-item-compact no-asterisk ${className || ''}`}
      normalize={normalize ? (value: string) => normalize(guard.normalize(value)) : guard.normalize}
      validateTrigger={validateTrigger}
    >
      <Input
        {...guard.input}
        placeholder={placeholder}
        allowClear={allowClear}
        disabled={disabled}
      />
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
