import React, { useEffect } from 'react';
import { Form, Select } from 'antd';
import dayjs from 'dayjs';
import { FILTER_PANEL } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';
import DatePicker from '../../../../../components/display/inputs/DatePicker';
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
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ timeMode, isCreateMode }) => {
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
    return current.isBefore(startAt, 'day');
  };

  const endDisabledTime = (current: dayjs.Dayjs | null) => {
    if (!startAt || !current || !current.isSame(startAt, 'day')) return {};
    const startHour = startAt.hour();
    const startMinute = startAt.minute();
    return {
      disabledHours: () => range(0, startHour),
      disabledMinutes: (selectedHour: number) =>
        selectedHour === startHour ? range(0, startMinute + 1) : [],
    };
  };

  return (
    <SectionCard title={SECTIONS.SCHEDULE_TITLE} description={SECTIONS.SCHEDULE_DESCRIPTION}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Form.Item
          name="timeMode"
          label={FORM.TIME_MODE_LABEL}
          style={{ marginBottom: 0 }}
          className={FORM_ITEM_CLASS}
        >
          <Select options={PPC.CREATE_PAGE.TIME_MODE_OPTIONS} style={{ width: 200 }} />
        </Form.Item>

        {timeMode === 'time_range' && (
          <div
            className="plan-date-range"
            style={{ ...FILTER_PANEL.DATE_RANGE_CONTAINER, alignItems: 'flex-end' }}
          >
            <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
              <Form.Item
                name="startAt"
                label={FORM.START_AT_LABEL}
                style={{ marginBottom: 0 }}
                className={FORM_ITEM_CLASS}
                rules={[{ required: true, message: FORM.START_REQUIRED_ERROR }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  style={FILTER_PANEL.DATE_INPUT}
                  disabledDate={(d) => (isCreateMode ? d.isBefore(dayjs(), 'day') : false)}
                />
              </Form.Item>
            </div>
            <div style={{ ...FILTER_PANEL.DATE_ARROW, marginBottom: 4 }}>→</div>
            <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
              <Form.Item
                name="endAt"
                label={FORM.END_AT_LABEL}
                style={{ marginBottom: 0 }}
                className={FORM_ITEM_CLASS}
                dependencies={['startAt']}
                rules={[{ required: true, message: FORM.END_REQUIRED_ERROR }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  style={FILTER_PANEL.DATE_INPUT}
                  disabled={!startAt}
                  disabledDate={endDisabledDate}
                  disabledTime={endDisabledTime}
                />
              </Form.Item>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default ScheduleSection;
