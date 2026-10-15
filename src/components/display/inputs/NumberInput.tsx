import React from 'react';
import { Form, InputNumber, Space } from 'antd';

export interface NumberInputProps {
  value?: number;
  onChange?: (value: number | null) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  addonAfter?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  step?: number | string;
}

// antd 6 deprecates InputNumber's addon props: this is the addon they rendered, with form status.
const NumberAddon: React.FC<{ children: React.ReactNode; disabled: boolean }> = ({
  children,
  disabled,
}) => {
  const { status } = Form.Item.useStatus();
  return (
    <Space.Addon disabled={disabled} status={status}>
      {children}
    </Space.Addon>
  );
};

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder,
  min,
  max,
  disabled = false,
  addonAfter,
  style,
  className,
  step,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ].includes(e.key)
    ) {
      return;
    }
    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }
    if (/^[0-9]$/.test(e.key)) {
      return;
    }
    if (e.key === '.') {
      return;
    }
    if (e.key === '-' && (min === undefined || min < 0)) {
      return;
    }
    e.preventDefault();
  };

  const input = (
    <InputNumber
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      disabled={disabled}
      style={style}
      className={className}
      step={step}
      controls
      onKeyDown={handleKeyDown}
      parser={(displayValue) => {
        if (!displayValue) return 0;
        const cleaned = displayValue.toString().replace(/[^\d.-]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      }}
      formatter={(value) => {
        if (value === undefined || value === null) return '';
        return value.toString();
      }}
    />
  );

  if (!addonAfter) return input;
  return (
    <Space.Compact>
      {input}
      <NumberAddon disabled={disabled}>{addonAfter}</NumberAddon>
    </Space.Compact>
  );
};

export default NumberInput;
