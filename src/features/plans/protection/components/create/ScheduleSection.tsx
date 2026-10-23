import React, { useEffect } from 'react';
import { Form, Select } from 'antd';
import dayjs from 'dayjs';
import { FILTER_PANEL, SPACING } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import Section from '../../../../../components/display/sections/Section';
import DatePicker from '../../../../../components/display/inputs/DatePicker';
import { toZonedDayjs, zonedNow } from '../../../../../utils/layout';
import RepeatFields from '../shared/RepeatFields';
import { FORM_ITEM_CLASS } from './types';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;

const range = (start: number, end: number): number[] => {
  const out: number[] = [];
  for (let i = start; i < end; i += 1) out.push(i);
  return out;
};

interface ScheduleSectionProps {
  timeMode: string;
  isCreateMode: boolean;
  disabled?: boolean;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  timeMode,
  isCreateMode,
  disabled = false,
}) => {
  const form = Form.useFormInstance();
  const startAt = Form.useWatch<dayjs.Dayjs | undefined>('startAt');

  useEffect(() => {
    if (!startAt) return;
    const curEnd = form.getFieldValue('endAt') as dayjs.Dayjs | undefined;
    if (!curEnd || !curEnd.isAfter(startAt)) {
      form.setFieldValue('endAt', startAt.add(1, 'minute'));
    }
  }, [startAt, form]);

  const endDisabledDate = (current: dayjs.Dayjs) => {
    if (!startAt) return false;
    return current.isBefore(toZonedDayjs(startAt), 'day');
  };

  const endDisabledTime = (current: dayjs.Dayjs | null) => {
    if (!startAt || !current) return {};
    const zonedStart = toZonedDayjs(startAt);
    if (!current.isSame(zonedStart, 'day')) return {};
    const startHour = zonedStart.hour();
    const startMinute = zonedStart.minute();
    return {
      disabledHours: () => range(0, startHour),
      disabledMinutes: (selectedHour: number) =>
        selectedHour === startHour ? range(0, startMinute + 1) : [],
    };
  };

  return (
    <Section
      title={SECTIONS.SCHEDULE_TITLE}
      subtitle={SECTIONS.SCHEDULE_DESCRIPTION}
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.MD }}>
          <Form.Item
            name="timeMode"
            label={FORM.TIME_MODE_LABEL}
            style={{ marginBottom: SPACING.NONE }}
            className={FORM_ITEM_CLASS}
          >
            <Select
              options={PPC.CREATE_PAGE.TIME_MODE_OPTIONS}
              style={{ width: '100%' }}
              disabled={disabled}
            />
          </Form.Item>

          {timeMode === 'time_range' && (
            <div
              className="plan-date-range"
              style={{ ...FILTER_PANEL.DATE_RANGE_CONTAINER, alignItems: 'flex-end' }}
            >
              <div style={{ ...FILTER_PANEL.DATE_INPUT_WRAPPER, minWidth: 0 }}>
                <Form.Item
                  name="startAt"
                  label={FORM.START_AT_LABEL}
                  style={{ marginBottom: SPACING.NONE }}
                  className={FORM_ITEM_CLASS}
                  rules={[{ required: true, message: FORM.START_REQUIRED_ERROR }]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    style={FILTER_PANEL.DATE_INPUT}
                    disabled={disabled}
                    disabledDate={(d) => (isCreateMode ? d.isBefore(zonedNow(), 'day') : false)}
                  />
                </Form.Item>
              </div>
              <div style={{ ...FILTER_PANEL.DATE_ARROW, marginBottom: SPACING.XS }}>→</div>
              <div style={{ ...FILTER_PANEL.DATE_INPUT_WRAPPER, minWidth: 0 }}>
                <Form.Item
                  name="endAt"
                  label={FORM.END_AT_LABEL}
                  style={{ marginBottom: SPACING.NONE }}
                  className={FORM_ITEM_CLASS}
                  dependencies={['startAt']}
                  rules={[{ required: true, message: FORM.END_REQUIRED_ERROR }]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    style={FILTER_PANEL.DATE_INPUT}
                    disabled={disabled || !startAt}
                    disabledDate={endDisabledDate}
                    disabledTime={endDisabledTime}
                  />
                </Form.Item>
              </div>
            </div>
          )}

          {timeMode === 'repeating' && <RepeatFields disabled={disabled} />}
        </div>
      }
    />
  );
};

export default ScheduleSection;
