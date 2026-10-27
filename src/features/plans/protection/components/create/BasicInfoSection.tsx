import React from 'react';
import { Form, Input, Select } from 'antd';
import {
  PLAN_PRIORITY_MIN,
  PROTECTION_PLANS_CONSTANTS as PPC,
} from '../../constants/protectionPlans';
import Section from '../../../../../components/display/sections/Section';
import { FORM_FIELD_PAIR_STYLE, FORM_ITEM_CLASS } from './types';
import { SPACING } from '../../../../../constants';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;

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
          rules={[
            { required: true, message: FORM.NAME_REQUIRED_ERROR },
            { validator: nameValidator },
          ]}
          validateTrigger="onChange"
          style={{ marginBottom: SPACING.MD }}
          className={FORM_ITEM_CLASS}
        >
          <Input placeholder={FORM.NAME_PLACEHOLDER} />
        </Form.Item>
        <Form.Item
          name="description"
          label={FORM.DESCRIPTION_LABEL}
          style={{ marginBottom: SPACING.MD }}
          className={FORM_ITEM_CLASS}
        >
          <Input placeholder={FORM.DESCRIPTION_PLACEHOLDER} />
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
            <Input type="number" min={PLAN_PRIORITY_MIN} placeholder="e.g. 1" />
          </Form.Item>
        </div>
      </div>
    }
  />
);

export default BasicInfoSection;
