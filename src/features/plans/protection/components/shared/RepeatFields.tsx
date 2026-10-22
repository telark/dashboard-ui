import React, { useMemo } from 'react';
import { Checkbox, Form, Select, TimePicker } from 'antd';
import type dayjs from 'dayjs';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { buildTimeZoneOptions } from '../../../../../utils/shared/time';
import { FORM_FIELD_PAIR_STYLE, FORM_ITEM_CLASS } from '../create/types';
import { REPEAT_CLOCK_BASE } from '../../utils/planFormValues';
import { DATE_PICKER_POPUP_CLASS, SPACING } from '../../../../../constants';

const { FORM, REPEAT_DAY_OPTIONS, REPEAT_TIME_FORMAT } = PPC.CREATE_PAGE;

interface RepeatFieldsProps {
  disabled?: boolean;
}

const RepeatFields: React.FC<RepeatFieldsProps> = ({ disabled = false }) => {
  const timeZoneOptions = useMemo(() => buildTimeZoneOptions(), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.MD }}>
      <Form.Item
        name="repeatDays"
        label={FORM.REPEAT_DAYS_LABEL}
        style={{ marginBottom: SPACING.NONE }}
        className={FORM_ITEM_CLASS}
        rules={[
          { required: true, type: 'array', min: 1, message: FORM.REPEAT_DAYS_REQUIRED_ERROR },
        ]}
      >
        <Checkbox.Group options={REPEAT_DAY_OPTIONS} disabled={disabled} />
      </Form.Item>
      <div style={FORM_FIELD_PAIR_STYLE}>
        <Form.Item
          name="repeatStart"
          label={FORM.REPEAT_START_LABEL}
          style={{ marginBottom: SPACING.NONE }}
          className={FORM_ITEM_CLASS}
          rules={[{ required: true, message: FORM.START_REQUIRED_ERROR }]}
        >
          <TimePicker
            format={REPEAT_TIME_FORMAT}
            needConfirm={false}
            defaultOpenValue={REPEAT_CLOCK_BASE}
            style={{ width: '100%' }}
            disabled={disabled}
            classNames={{ popup: { root: DATE_PICKER_POPUP_CLASS } }}
          />
        </Form.Item>
        <Form.Item
          name="repeatEnd"
          label={FORM.REPEAT_END_LABEL}
          style={{ marginBottom: SPACING.NONE }}
          className={FORM_ITEM_CLASS}
          dependencies={['repeatStart']}
          rules={[
            { required: true, message: FORM.END_REQUIRED_ERROR },
            ({ getFieldValue }) => ({
              validator(_, value: dayjs.Dayjs | undefined) {
                const start = getFieldValue('repeatStart') as dayjs.Dayjs | undefined;
                const same =
                  value &&
                  start &&
                  value.format(REPEAT_TIME_FORMAT) === start.format(REPEAT_TIME_FORMAT);
                return same
                  ? Promise.reject(new Error(FORM.REPEAT_SAME_TIME_ERROR))
                  : Promise.resolve();
              },
            }),
          ]}
        >
          <TimePicker
            format={REPEAT_TIME_FORMAT}
            needConfirm={false}
            defaultOpenValue={REPEAT_CLOCK_BASE}
            style={{ width: '100%' }}
            disabled={disabled}
            classNames={{ popup: { root: DATE_PICKER_POPUP_CLASS } }}
          />
        </Form.Item>
      </div>
      <Form.Item
        name="repeatTimeZone"
        label={FORM.REPEAT_TIME_ZONE_LABEL}
        extra={FORM.REPEAT_HELP}
        style={{ marginBottom: SPACING.NONE }}
        className={FORM_ITEM_CLASS}
        rules={[{ required: true, message: FORM.REPEAT_TIME_ZONE_REQUIRED_ERROR }]}
      >
        <Select showSearch optionFilterProp="label" options={timeZoneOptions} disabled={disabled} />
      </Form.Item>
    </div>
  );
};

export default RepeatFields;
