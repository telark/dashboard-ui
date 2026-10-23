import React from 'react';
import { Select } from 'antd';
import { DEFAULT_COLORS, FONT_SIZE } from '../../../../../../../constants';
import type { LevelSelectorProps } from '../../../../models';
import type { PermissionLevel } from '../../../../models/types';

const DESCRIPTION_STYLE: React.CSSProperties = {
  fontSize: FONT_SIZE.SM,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  whiteSpace: 'normal',
};

// What each level allows is visible text, never a hover: under each option and under the select.
const LevelSelector: React.FC<LevelSelectorProps> = ({
  value,
  onChange,
  options,
  descriptionMap,
  placeholder = 'Select permission level',
  style,
  disabled = false,
}) => (
  <>
    <Select
      placeholder={placeholder}
      style={style}
      value={value}
      options={options.map((level) => ({ value: level.value, label: level.label }))}
      optionRender={(option) => (
        <>
          <div>{option.label}</div>
          <div style={DESCRIPTION_STYLE}>{descriptionMap[option.value as PermissionLevel]}</div>
        </>
      )}
      onChange={onChange}
      allowClear
      disabled={disabled}
    />
    {value ? <div style={DESCRIPTION_STYLE}>{descriptionMap[value]}</div> : null}
  </>
);

export default LevelSelector;
