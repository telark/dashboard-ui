import React, { useState } from 'react';
import { SLIDE_OUT } from '../../../../constants';
import FilterPanelHeader from './FilterPanelHeader';
import FilterPanelFooter from './FilterPanelFooter';
import FilterFieldRenderer from './FilterFieldRenderer';

export type FilterFieldType = 'dateRange' | 'buttonGroup' | 'dropdown' | 'multiSelect';

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
  fromLabel?: string;
  toLabel?: string;
  options?: FilterButtonOption[];
  dropdownOptions?: FilterDropdownOption[];
  multiSelectOptions?: FilterDropdownOption[];
  defaultValue?: string | { from?: string; to?: string };
}

export interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  subtitle?: string;
  fields: FilterField[];
  value?: Record<string, unknown>;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  onApply?: (filters: Record<string, unknown>) => void;
  onReset?: () => void;
  width?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  open,
  onClose,
  subtitle = 'Adjust filters to refine results',
  fields,
  value,
  onFilterChange,
  onApply,
  onReset,
  width = 480,
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
      } else if (field.type === 'multiSelect' && field.multiSelectOptions) {
        initial[field.key] = [];
      } else if (field.type === 'dateRange') {
        initial[field.key] = { from: undefined, to: undefined };
      }
    });
    return initial;
  });

  const currentFilters = value ?? filters;
  const isControlled = value !== undefined;

  const handleFilterChange = (key: string, nextValue: unknown) => {
    const newFilters = { ...currentFilters, [key]: nextValue };
    if (!isControlled) {
      setFilters(newFilters);
    }
    onFilterChange?.(newFilters);
  };

  const handleApply = () => {
    onApply?.(currentFilters);
  };

  const handleReset = () => {
    const resetFilters: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        resetFilters[field.key] = field.defaultValue;
      } else if (field.type === 'buttonGroup' && field.options) {
        resetFilters[field.key] = field.options[0]?.key || '';
      } else if (field.type === 'dropdown' && field.dropdownOptions) {
        resetFilters[field.key] = field.dropdownOptions[0]?.value || '';
      } else if (field.type === 'multiSelect' && field.multiSelectOptions) {
        resetFilters[field.key] = [];
      } else if (field.type === 'dateRange') {
        resetFilters[field.key] = { from: undefined, to: undefined };
      }
    });
    if (!isControlled) {
      setFilters(resetFilters);
    }
    onFilterChange?.(resetFilters);
    onReset?.();
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={SLIDE_OUT.BACKDROP} />
      <div
        style={{
          ...SLIDE_OUT.PANEL,
          width: width,
        }}
      >
        <FilterPanelHeader onClose={onClose} subtitle={subtitle} />

        <div style={SLIDE_OUT.CONTENT}>
          <div style={SLIDE_OUT.FORM}>
            <div style={{ ...SLIDE_OUT.FORM_CONTENT, gap: 24 }}>
              {fields.map((field) => (
                <FilterFieldRenderer
                  key={field.key}
                  field={field}
                  value={currentFilters[field.key]}
                  onChange={(val) => handleFilterChange(field.key, val)}
                />
              ))}
            </div>

            <FilterPanelFooter onReset={handleReset} onApply={handleApply} />
          </div>
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
