import React, { useState } from 'react';
import { Space, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { DatePicker } from '../../inputs';
import { SLIDE_OUT, FILTER_PANEL } from '../../../../constants';
import type { Dayjs } from 'dayjs';

export type FilterFieldType = 'dateRange' | 'buttonGroup' | 'dropdown';

export interface FilterButtonOption {
  key: string;
  label: string;
}

export interface FilterDropdownOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  // For dateRange
  fromLabel?: string;
  toLabel?: string;
  // For buttonGroup
  options?: FilterButtonOption[];
  // For dropdown
  dropdownOptions?: FilterDropdownOption[];
  defaultValue?: string | { from?: string; to?: string };
}

export interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  fields: FilterField[];
  onFilterChange?: (filters: Record<string, unknown>) => void;
  onApply?: (filters: Record<string, unknown>) => void;
  onReset?: () => void;
  width?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  open,
  onClose,
  fields,
  onFilterChange,
  onApply,
  onReset,
  width = 400,
}) => {
  const [filters, setFilters] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.defaultValue) {
        initial[field.key] = field.defaultValue;
      } else if (field.type === 'buttonGroup' && field.options) {
        initial[field.key] = field.options[0]?.key || '';
      } else if (field.type === 'dropdown' && field.dropdownOptions) {
        initial[field.key] = field.dropdownOptions[0]?.value || '';
      } else if (field.type === 'dateRange') {
        initial[field.key] = { from: undefined, to: undefined };
      }
    });
    return initial;
  });

  const handleFilterChange = (key: string, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleDateRangeChange = (key: string, type: 'from' | 'to', date: Dayjs | null) => {
    const currentRange = (filters[key] as { from?: Dayjs | null; to?: Dayjs | null }) || {
      from: undefined,
      to: undefined,
    };
    const newRange = {
      ...currentRange,
      [type]: date,
    };
    handleFilterChange(key, newRange);
  };

  const handleButtonGroupChange = (key: string, optionKey: string) => {
    handleFilterChange(key, optionKey);
  };

  const handleDropdownChange = (key: string, value: string) => {
    handleFilterChange(key, value);
  };

  const handleApply = () => {
    onApply?.(filters);
  };

  const handleReset = () => {
    const resetFilters: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.defaultValue) {
        resetFilters[field.key] = field.defaultValue;
      } else if (field.type === 'buttonGroup' && field.options) {
        resetFilters[field.key] = field.options[0]?.key || '';
      } else if (field.type === 'dropdown' && field.dropdownOptions) {
        resetFilters[field.key] = field.dropdownOptions[0]?.value || '';
      } else if (field.type === 'dateRange') {
        resetFilters[field.key] = { from: undefined, to: undefined };
      }
    });
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
    onReset?.();
  };

  if (!open) return null;

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'dateRange': {
        const dateRange = (filters[field.key] as { from?: Dayjs | null; to?: Dayjs | null }) || {
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
                  onChange={(date) => handleDateRangeChange(field.key, 'from', date)}
                  placeholder="dd / mm / yyyy"
                  format="DD / MM / YYYY"
                  showTime={false}
                  style={FILTER_PANEL.DATE_INPUT}
                />
              </div>
              <div style={FILTER_PANEL.DATE_ARROW}>→</div>
              <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
                <label style={FILTER_PANEL.DATE_LABEL}>{field.toLabel || 'To'}</label>
                <DatePicker
                  value={dateRange.to || undefined}
                  onChange={(date) => handleDateRangeChange(field.key, 'to', date)}
                  placeholder="dd / mm / yyyy"
                  format="DD / MM / YYYY"
                  showTime={false}
                  style={FILTER_PANEL.DATE_INPUT}
                />
              </div>
            </div>
          </div>
        );
      }

      case 'buttonGroup': {
        const selectedValue = (filters[field.key] as string) || field.options?.[0]?.key || '';
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
                    onClick={() => handleButtonGroupChange(field.key, option.key)}
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
      }

      case 'dropdown': {
        const selectedValue =
          (filters[field.key] as string) || field.dropdownOptions?.[0]?.value || '';
        return (
          <div key={field.key} style={FILTER_PANEL.SECTION}>
            <div style={FILTER_PANEL.SECTION_TITLE}>{field.label}</div>
            <Select
              value={selectedValue}
              onChange={(value) => handleDropdownChange(field.key, value)}
              style={FILTER_PANEL.DROPDOWN}
              options={field.dropdownOptions}
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={FILTER_PANEL.BACKDROP} />
      {/* Panel */}
      <div
        style={{
          ...FILTER_PANEL.PANEL,
          width: width,
        }}
      >
        {/* Header */}
        <div style={FILTER_PANEL.HEADER}>
          <h2 style={FILTER_PANEL.TITLE}>Filter</h2>
          <button
            type="button"
            onClick={onClose}
            style={FILTER_PANEL.CLOSE_BUTTON}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0B1F33';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Content */}
        <div style={FILTER_PANEL.CONTENT}>{fields.map(renderField)}</div>

        {/* Footer */}
        <div style={FILTER_PANEL.FOOTER}>
          <button type="button" onClick={handleReset} style={FILTER_PANEL.RESET_BUTTON}>
            Reset
          </button>
          <button type="button" onClick={handleApply} style={FILTER_PANEL.APPLY_BUTTON}>
            Apply
          </button>
        </div>
      </div>

      <style>
        {SLIDE_OUT.KEYFRAMES.SLIDE_IN_RIGHT}
        {SLIDE_OUT.KEYFRAMES.FADE_IN}
      </style>
    </>
  );
};

export default FilterPanel;
