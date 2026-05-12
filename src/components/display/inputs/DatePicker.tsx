import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import '../../../styles/datePicker.css';
import { getDisabledTimeForFutureDates } from '../../../utils/layout';

export interface DisabledTimeConfig {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
}

export interface DatePickerProps {
  value?: Dayjs | string;
  onChange?: (date: Dayjs | null, dateString: string | null) => void;
  placeholder?: string;
  format?: string;
  showTime?: boolean;
  disabled?: boolean;
  disabledDate?: (current: Dayjs) => boolean;
  disabledTime?: (current: Dayjs | null) => DisabledTimeConfig;
  style?: React.CSSProperties;
  className?: string;
  allowClear?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder,
  format = 'YYYY-MM-DD HH:mm',
  showTime = true,
  disabled = false,
  disabledDate,
  disabledTime,
  style,
  className,
  allowClear = true,
}) => {
  const handleChange = (date: Dayjs | null, dateString: string | null) => {
    if (onChange && date) {
      // Always set seconds to 00
      const dateWithZeroSeconds = date.second(0).millisecond(0);
      onChange(dateWithZeroSeconds, dateString);
    } else if (onChange) {
      onChange(null, dateString);
    }
  };

  return (
    <div className="custom-date-picker-wrapper">
      <AntDatePicker
        value={typeof value === 'string' ? dayjs(value) : value}
        onChange={handleChange}
        placeholder={placeholder}
        format={format}
        showTime={
          showTime
            ? {
                format: 'HH:mm',
                showSecond: false,
                disabledTime: disabledTime ?? getDisabledTimeForFutureDates(),
              }
            : false
        }
        disabled={disabled}
        disabledDate={disabledDate}
        style={style}
        className={className}
        allowClear={allowClear}
        classNames={{
          popup: {
            root: 'custom-date-picker-popup',
          },
        }}
      />
    </div>
  );
};

export default DatePicker;
