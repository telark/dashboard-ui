import React from 'react';
import { Space, Select } from 'antd';
import { DatePicker } from '../../inputs';
import { FILTER_PANEL, FILTER_PANEL_CONFIG } from '../../../../constants';
import type { FilterField, FilterFieldType } from './FilterPanel';
import type { Dayjs } from 'dayjs';

interface FilterFieldRendererProps {
  field: FilterField;
  value: unknown;
  onChange: (value: unknown) => void;
}

const FilterFieldRenderer: React.FC<FilterFieldRendererProps> = ({ field, value, onChange }) => {
  const renderDateRange = () => {
    const dateRange = (value as { from?: Dayjs | null; to?: Dayjs | null }) || {
      from: undefined,
      to: undefined,
    };
    return (
      <div key={field.key} style={FILTER_PANEL.SECTION}>
        <div style={FILTER_PANEL.SECTION_TITLE}>{field.label}</div>
        <div style={FILTER_PANEL.DATE_RANGE_CONTAINER}>
          <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
            <label style={FILTER_PANEL.DATE_LABEL}>{field.fromLabel || 'From'}</label>
            <DatePicker
              value={dateRange.from || undefined}
              onChange={(date) => onChange({ ...dateRange, from: date })}
              placeholder={FILTER_PANEL_CONFIG.DATE_PLACEHOLDER}
              format={FILTER_PANEL_CONFIG.DATE_FORMAT}
              showTime={false}
              style={FILTER_PANEL.DATE_INPUT}
            />
          </div>
          <div style={FILTER_PANEL.DATE_ARROW}>→</div>
          <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
            <label style={FILTER_PANEL.DATE_LABEL}>{field.toLabel || 'To'}</label>
            <DatePicker
              value={dateRange.to || undefined}
              onChange={(date) => onChange({ ...dateRange, to: date })}
              placeholder={FILTER_PANEL_CONFIG.DATE_PLACEHOLDER}
              format={FILTER_PANEL_CONFIG.DATE_FORMAT}
              showTime={false}
              style={FILTER_PANEL.DATE_INPUT}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderButtonGroup = () => {
    const selectedValue = (value as string) || field.options?.[0]?.key || '';
    return (
      <div key={field.key} style={FILTER_PANEL.SECTION}>
        <div style={FILTER_PANEL.SECTION_TITLE}>{field.label}</div>
        <Space wrap={false} size={[8, 8]}>
          {field.options?.map((option) => {
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
  };

  const renderDropdown = () => {
    const selectedValue = (value as string) || field.dropdownOptions?.[0]?.value || '';
    return (
      <div key={field.key} style={FILTER_PANEL.SECTION}>
        <div style={FILTER_PANEL.SECTION_TITLE}>{field.label}</div>
        <Select
          value={selectedValue}
          onChange={(val) => onChange(val)}
          style={FILTER_PANEL.DROPDOWN}
          options={field.dropdownOptions}
        />
      </div>
    );
  };

  const renderers: Record<FilterFieldType, () => React.ReactNode> = {
    dateRange: renderDateRange,
    buttonGroup: renderButtonGroup,
    dropdown: renderDropdown,
  };

  return <>{renderers[field.type]?.()}</>;
};

export default FilterFieldRenderer;
