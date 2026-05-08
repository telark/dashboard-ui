import React from 'react';
import { Form, Select } from 'antd';
import dayjs from 'dayjs';
import { FILTER_PANEL } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';
import DatePicker from '../../../../../components/display/inputs/DatePicker';
import { FORM_ITEM_CLASS } from './types';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;

interface ScheduleSectionProps {
  timeMode: string;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ timeMode }) => (
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
        <div style={{ ...FILTER_PANEL.DATE_RANGE_CONTAINER, alignItems: 'flex-end' }}>
          <div style={FILTER_PANEL.DATE_INPUT_WRAPPER}>
            <Form.Item
              name="startAt"
              label={FORM.START_AT_LABEL}
              style={{ marginBottom: 0 }}
              className={FORM_ITEM_CLASS}
              rules={[{ required: true, message: 'Start time is required' }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={FILTER_PANEL.DATE_INPUT}
                disabledDate={(d) => d.isBefore(dayjs(), 'day')}
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
              rules={[
                { required: true, message: 'End time is required' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue('startAt') as dayjs.Dayjs | undefined;
                    if (!value || !start || value.isAfter(start)) return Promise.resolve();
                    return Promise.reject(new Error('End must be after start'));
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={FILTER_PANEL.DATE_INPUT}
                disabledDate={(d) => d.isBefore(dayjs(), 'day')}
              />
            </Form.Item>
          </div>
        </div>
      )}
    </div>
  </SectionCard>
);

export default ScheduleSection;
