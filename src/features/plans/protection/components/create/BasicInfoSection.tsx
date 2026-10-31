import React from 'react';
import { Form, Input, Select } from 'antd';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import Section from '../../../../../components/display/sections/Section';
import { NumberInput } from '../../../../../components/display/inputs';
import { FORM_FIELD_PAIR_STYLE, FORM_ITEM_CLASS } from './types';
import { INPUT_LIMITS, SPACING } from '../../../../../constants';
import { inputGuard } from '../../../../../utils/helpers/inputGuard';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;
const nameGuard = inputGuard(INPUT_LIMITS.PLAN_NAME.MAX, { required: FORM.NAME_REQUIRED_ERROR });
const descriptionGuard = inputGuard(INPUT_LIMITS.PLAN_DESCRIPTION.MAX, { multiline: true });

interface BasicInfoSectionProps {
  nameValidator: (rule: unknown, value: string | undefined) => Promise<void>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ nameValidator }) => (
  <Section
    title={SECTIONS.BASIC_INFO_TITLE}
    subtitle={SECTIONS.BASIC_INFO_DESCRIPTION}
    content={
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.NONE }}>
        <Form.Item
          name="name"
          label={FORM.NAME_LABEL}
          normalize={nameGuard.normalize}
          rules={[...nameGuard.rules, { validator: nameValidator }]}
          validateTrigger="onChange"
          style={{ marginBottom: SPACING.MD }}
          className={FORM_ITEM_CLASS}
        >
          <Input {...nameGuard.input} placeholder={FORM.NAME_PLACEHOLDER} />
        </Form.Item>
        <Form.Item
          name="description"
          label={FORM.DESCRIPTION_LABEL}
          normalize={descriptionGuard.normalize}
          style={{ marginBottom: SPACING.MD }}
          className={FORM_ITEM_CLASS}
        >
          <Input.TextArea
            {...descriptionGuard.input}
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder={FORM.DESCRIPTION_PLACEHOLDER}
          />
        </Form.Item>
        <div style={FORM_FIELD_PAIR_STYLE}>
          <Form.Item
            name="severity"
            label={FORM.SEVERITY_LABEL}
            style={{ marginBottom: SPACING.NONE }}
            className={FORM_ITEM_CLASS}
            rules={[{ required: true, message: FORM.SEVERITY_REQUIRED_ERROR }]}
          >
            <Select
              placeholder="Select severity"
              options={PPC.CREATE_PAGE.SEVERITY_OPTIONS}
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="priority"
            label={FORM.PRIORITY_LABEL}
            style={{ marginBottom: SPACING.NONE }}
            className={FORM_ITEM_CLASS}
          >
            <NumberInput
              min={INPUT_LIMITS.PLAN_PRIORITY.MIN}
              max={INPUT_LIMITS.PLAN_PRIORITY.MAX}
              placeholder="e.g. 1"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </div>
      </div>
    }
  />
);

export default BasicInfoSection;
