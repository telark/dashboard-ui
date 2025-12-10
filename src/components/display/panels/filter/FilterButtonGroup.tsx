import React from 'react';
import { Space } from 'antd';
import { FILTER_PANEL } from '../../../../constants';
import type { FilterButtonOption } from './FilterPanel';

export interface FilterButtonGroupProps {
  label: string;
  options: FilterButtonOption[];
  value?: string;
  onChange: (value: string) => void;
}

const FilterButtonGroup: React.FC<FilterButtonGroupProps> = React.memo(
  ({ label, options, value, onChange }) => {
    const selectedValue = value || options[0]?.key || '';

    return (
      <div style={FILTER_PANEL.SECTION}>
        <div style={FILTER_PANEL.SECTION_TITLE}>{label}</div>
        <Space wrap={false} size={[8, 8]}>
          {options.map((option) => {
            const isActive = selectedValue === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange(option.key)}
                style={{
                  ...FILTER_PANEL.BUTTON_BASE,
                  ...(isActive ? FILTER_PANEL.BUTTON_ACTIVE : FILTER_PANEL.BUTTON_INACTIVE),
                }}
              >
                {option.label}
              </button>
            );
          })}
        </Space>
      </div>
    );
  },
);

FilterButtonGroup.displayName = 'FilterButtonGroup';

export default FilterButtonGroup;
