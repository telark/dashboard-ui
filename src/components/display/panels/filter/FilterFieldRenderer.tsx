import React from 'react';
import { Form, Select } from 'antd';
import { DatePicker } from '../../inputs';
import { FILTER_PANEL, FILTER_PANEL_CONFIG } from '../../../../constants';
import type { FilterField, FilterFieldType } from './FilterPanel';
import type { Dayjs } from 'dayjs';
import FilterButtonGroup from './FilterButtonGroup';
import { toZonedDayjs } from '../../../../utils/layout';

interface FilterFieldRendererProps {
  field: FilterField;
  value: unknown;
  onChange: (value: unknown) => void;
}

// Laid out like the panels' form fields (compact label, 16px between fields).
const FILTER_ITEM = {
  className: FILTER_PANEL.ITEM_CLASS,
  style: FILTER_PANEL.ITEM,
};

const FilterFieldRenderer: React.FC<FilterFieldRendererProps> = ({ field, value, onChange }) => {
  const renderDateRange = () => {
    const dateRange = (value as { from?: Dayjs | null; to?: Dayjs | null }) || {
      from: undefined,
      to: undefined,
    };
    const disableFromDate = (current: Dayjs) => {
      if (!dateRange.to) return false;
      return current.isAfter(toZonedDayjs(dateRange.to), 'day');
    };
    const disableToDate = (current: Dayjs) => {
      if (!dateRange.from) return false;
      return current.isBefore(toZonedDayjs(dateRange.from), 'day');
    };
    return (
      <Form.Item key={field.key} label={field.label} {...FILTER_ITEM}>
        <div style={FILTER_PANEL.DATE_RANGE_CONTAINER}>
          <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
            <DatePicker
              value={dateRange.from || undefined}
              onChange={(date) => onChange({ ...dateRange, from: date })}
              placeholder={`From (${FILTER_PANEL_CONFIG.DATE_PLACEHOLDER})`}
              format={FILTER_PANEL_CONFIG.DATE_FORMAT}
              showTime={false}
              disabledDate={disableFromDate}
              style={FILTER_PANEL.DATE_INPUT}
            />
          </div>
          <div style={FILTER_PANEL.DATE_ARROW}>→</div>
          <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
            <DatePicker
              value={dateRange.to || undefined}
              onChange={(date) => onChange({ ...dateRange, to: date })}
              placeholder={`To (${FILTER_PANEL_CONFIG.DATE_PLACEHOLDER})`}
              format={FILTER_PANEL_CONFIG.DATE_FORMAT}
              showTime={false}
              disabledDate={disableToDate}
              style={FILTER_PANEL.DATE_INPUT}
            />
          </div>
        </div>
      </Form.Item>
    );
  };

  const renderButtonGroup = () => {
    if (!field.options) return null;
    return (
      <Form.Item key={field.key} label={field.label} {...FILTER_ITEM}>
        <FilterButtonGroup
          options={field.options}
          value={value as string | undefined}
          onChange={(val) => onChange(val)}
        />
      </Form.Item>
    );
  };

  const renderDropdown = () => {
    const selectedValue = (value as string) || field.dropdownOptions?.[0]?.value || '';
    return (
      <Form.Item key={field.key} label={field.label} {...FILTER_ITEM}>
        <Select
          value={selectedValue}
          onChange={(val) => onChange(val)}
          style={FILTER_PANEL.DROPDOWN}
          options={field.dropdownOptions}
        />
      </Form.Item>
    );
  };

  const renderMultiSelect = () => {
    const selectedValues = (value as string[]) || [];
    const fieldOptionRender = field.optionRender;
    return (
      <Form.Item key={field.key} label={field.label} {...FILTER_ITEM}>
        <Select
          mode="multiple"
          value={selectedValues}
          onChange={(vals) => onChange(vals)}
          style={FILTER_PANEL.DROPDOWN}
          options={field.multiSelectOptions}
          placeholder="Select..."
          allowClear
          optionRender={
            fieldOptionRender
              ? (option) =>
                  fieldOptionRender({
                    value: String(option.value),
                    label: String(option.label ?? ''),
                  })
              : undefined
          }
          filterOption={(input, option) =>
            String(option?.label ?? '')
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        />
      </Form.Item>
    );
  };

  const renderers: Record<FilterFieldType, () => React.ReactNode> = {
    dateRange: renderDateRange,
    buttonGroup: renderButtonGroup,
    dropdown: renderDropdown,
    multiSelect: renderMultiSelect,
  };

  return <>{renderers[field.type]?.()}</>;
};

export default FilterFieldRenderer;
