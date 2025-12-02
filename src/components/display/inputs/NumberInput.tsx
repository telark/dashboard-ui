import React from 'react';
import { InputNumber } from 'antd';

export interface NumberInputProps {
  value?: number;
  onChange?: (value: number | null) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  precision?: number;
  step?: number | string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder,
  min,
  max,
  disabled = false,
  addonAfter,
  addonBefore,
  style,
  className,
  precision,
  step,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)
    ) {
      return;
    }
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }
    // Allow: numbers (0-9) on main keyboard and numpad
    if (/^[0-9]$/.test(e.key)) {
      return;
    }
    // Allow: decimal point (only if precision is not 0)
    if (e.key === '.' && precision !== 0) {
      return;
    }
    // Allow: minus sign (only if min is negative or not set)
    if (e.key === '-' && (min === undefined || min < 0)) {
      return;
    }
    // Block everything else
    e.preventDefault();
  };

  return (
    <InputNumber
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      disabled={disabled}
      addonAfter={addonAfter}
      addonBefore={addonBefore}
      style={style}
      className={className}
      precision={precision}
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
};

export default NumberInput;
