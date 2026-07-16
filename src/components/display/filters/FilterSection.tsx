import React from 'react';
import { Space } from 'antd';
import { CONTROL_HEIGHT, DEFAULT_COLORS } from '../../../constants';
import type { FilterSectionConfig } from '../../../interfaces/layout/filters';

interface FilterSectionProps {
  config: FilterSectionConfig | undefined;
}

const FilterSection: React.FC<FilterSectionProps> = ({ config }) => {
  if (!config) return null;

  const { label, options, selectedValue, onChange } = config;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>
      <Space wrap={false} size={[8, 8]}>
        {options.map((option) => {
          const isActive = selectedValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                borderRadius: 20,
                height: CONTROL_HEIGHT,
                padding: '0 16px',
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                border: `1px solid ${isActive ? DEFAULT_COLORS.SUCCESS : '#d9d9d9'}`,
                backgroundColor: isActive ? DEFAULT_COLORS.SUCCESS : '#fff',
                color: isActive ? '#fff' : DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
                transition: 'all 0.2s',
              }}
            >
              {option.label}
            </button>
          );
        })}
      </Space>
    </div>
  );
};

export default FilterSection;
