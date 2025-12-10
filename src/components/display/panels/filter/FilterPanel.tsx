import React, { useState } from 'react';
import { Space, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { DatePicker } from '../../inputs';
import { DEFAULT_COLORS } from '../../../../constants';
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
          <div key={field.key} style={FILTER_STYLES.SECTION}>
            <div style={FILTER_STYLES.SECTION_TITLE}>{field.label}</div>
            <div style={FILTER_STYLES.DATE_RANGE_CONTAINER}>
              <div style={FILTER_STYLES.DATE_INPUT_WRAPPER}>
                <label style={FILTER_STYLES.DATE_LABEL}>{field.fromLabel || 'From'}</label>
                <DatePicker
                  value={dateRange.from || undefined}
                  onChange={(date) => handleDateRangeChange(field.key, 'from', date)}
                  placeholder="dd / mm / yyyy"
                  format="DD / MM / YYYY"
                  showTime={false}
                  style={FILTER_STYLES.DATE_INPUT}
                />
              </div>
              <div style={FILTER_STYLES.DATE_ARROW}>→</div>
              <div style={FILTER_STYLES.DATE_INPUT_WRAPPER}>
                <label style={FILTER_STYLES.DATE_LABEL}>{field.toLabel || 'To'}</label>
                <DatePicker
                  value={dateRange.to || undefined}
                  onChange={(date) => handleDateRangeChange(field.key, 'to', date)}
                  placeholder="dd / mm / yyyy"
                  format="DD / MM / YYYY"
                  showTime={false}
                  style={FILTER_STYLES.DATE_INPUT}
                />
              </div>
            </div>
          </div>
        );
      }

      case 'buttonGroup': {
        const selectedValue = (filters[field.key] as string) || field.options?.[0]?.key || '';
        return (
          <div key={field.key} style={FILTER_STYLES.SECTION}>
            <div style={FILTER_STYLES.SECTION_TITLE}>{field.label}</div>
            <Space wrap={false} size={[8, 8]}>
              {field.options?.map((option) => {
                const isActive = selectedValue === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleButtonGroupChange(field.key, option.key)}
                    style={{
                      ...FILTER_STYLES.BUTTON_BASE,
                      ...(isActive ? FILTER_STYLES.BUTTON_ACTIVE : FILTER_STYLES.BUTTON_INACTIVE),
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
          <div key={field.key} style={FILTER_STYLES.SECTION}>
            <div style={FILTER_STYLES.SECTION_TITLE}>{field.label}</div>
            <Select
              value={selectedValue}
              onChange={(value) => handleDropdownChange(field.key, value)}
              style={FILTER_STYLES.DROPDOWN}
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
      <div onClick={onClose} style={FILTER_STYLES.BACKDROP} />
      {/* Panel */}
      <div
        style={{
          ...FILTER_STYLES.PANEL,
          width: width,
        }}
      >
        {/* Header */}
        <div style={FILTER_STYLES.HEADER}>
          <h2 style={FILTER_STYLES.TITLE}>Filter</h2>
          <button
            type="button"
            onClick={onClose}
            style={FILTER_STYLES.CLOSE_BUTTON}
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
        <div style={FILTER_STYLES.CONTENT}>{fields.map(renderField)}</div>

        {/* Footer */}
        <div style={FILTER_STYLES.FOOTER}>
          <button type="button" onClick={handleReset} style={FILTER_STYLES.RESET_BUTTON}>
            Reset
          </button>
          <button type="button" onClick={handleApply} style={FILTER_STYLES.APPLY_BUTTON}>
            Apply
          </button>
        </div>
      </div>

      <style>
        {FILTER_STYLES.KEYFRAMES.SLIDE_IN_RIGHT}
        {FILTER_STYLES.KEYFRAMES.FADE_IN}
      </style>
    </>
  );
};

const FILTER_STYLES = {
  BACKDROP: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1002,
    animation: 'fadeIn 0.2s ease-in-out',
  },
  PANEL: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    background: '#fff',
    zIndex: 1003,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
    animation: 'slideInRight 0.3s ease-out',
  },
  HEADER: {
    padding: '16px 24px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    background: '#f8fafc',
  },
  TITLE: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0B1F33',
    margin: 0,
    padding: 0,
  },
  CLOSE_BUTTON: {
    background: 'none',
    border: 'none',
    cursor: 'pointer' as const,
    padding: 4,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    color: '#64748b',
    fontSize: 18,
    transition: 'color 0.2s',
  },
  CONTENT: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 24,
  },
  SECTION: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 12,
  },
  SECTION_TITLE: {
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    fontFamily: "'Roboto Condensed', sans-serif",
  },
  DATE_RANGE_CONTAINER: {
    display: 'flex' as const,
    alignItems: 'flex-end' as const,
    gap: 12,
  },
  DATE_INPUT_WRAPPER: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 6,
    flex: 1,
  },
  DATE_LABEL: {
    fontSize: 13,
    fontWeight: 500,
    color: '#64748b',
  },
  DATE_INPUT: {
    width: '100%',
  },
  DATE_ARROW: {
    fontSize: 18,
    color: '#64748b',
    paddingBottom: 6,
  },
  BUTTON_BASE: {
    all: 'unset' as const,
    cursor: 'pointer' as const,
    borderRadius: 20,
    height: 32,
    padding: '0 16px',
    fontSize: 13,
    fontFamily: "'Roboto Condensed', sans-serif",
    transition: 'all 0.2s',
    fontWeight: 500,
  },
  BUTTON_ACTIVE: {
    fontWeight: 600,
    border: `1px solid ${DEFAULT_COLORS.SUCCESS}`,
    backgroundColor: DEFAULT_COLORS.SUCCESS,
    color: '#fff',
  },
  BUTTON_INACTIVE: {
    border: '1px solid #d9d9d9',
    backgroundColor: '#fff',
    color: '#64748b',
  },
  DROPDOWN: {
    width: '100%',
  },
  FOOTER: {
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f0',
    display: 'flex' as const,
    justifyContent: 'flex-end' as const,
    gap: 12,
    background: '#f8fafc',
  },
  RESET_BUTTON: {
    all: 'unset' as const,
    cursor: 'pointer' as const,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    color: '#64748b',
    borderRadius: 6,
    transition: 'all 0.2s',
  },
  APPLY_BUTTON: {
    all: 'unset' as const,
    cursor: 'pointer' as const,
    padding: '8px 24px',
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    backgroundColor: DEFAULT_COLORS.SUCCESS,
    borderRadius: 6,
    transition: 'all 0.2s',
  },
  KEYFRAMES: {
    SLIDE_IN_RIGHT: `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
    `,
    FADE_IN: `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  },
} as const;

export default FilterPanel;
