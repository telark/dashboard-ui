import React from 'react';
import { Select, Tooltip } from 'antd';
import type { PermissionLevel } from '../../../../models/types';

export interface LevelSelectorProps {
  value: PermissionLevel;
  onChange: (value: PermissionLevel) => void;
  options: readonly { value: PermissionLevel; label: string }[];
  tooltipMap: Record<PermissionLevel, string>;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  value,
  onChange,
  options,
  tooltipMap,
  placeholder = 'Select permission level',
  style,
  disabled = false,
}) => {
  return (
    <Select
      placeholder={placeholder}
      style={style}
      value={value}
      options={options.map((level) => ({
        value: level.value,
        label: (
          <Tooltip title={tooltipMap[level.value]}>
            <span>{level.label}</span>
          </Tooltip>
        ),
      }))}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default LevelSelector;
