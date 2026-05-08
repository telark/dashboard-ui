import React from 'react';
import { Form, Input, Select, Radio, Space, ConfigProvider } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';
import { FORM_ITEM_CLASS } from './types';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;

const BasicInfoSection: React.FC = () => (
  <SectionCard title={SECTIONS.BASIC_INFO_TITLE} description={SECTIONS.BASIC_INFO_DESCRIPTION}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Form.Item
        name="name"
        label={FORM.NAME_LABEL}
        rules={[{ required: true, message: 'Plan name is required' }]}
        style={{ marginBottom: 12 }}
        className={FORM_ITEM_CLASS}
      >
        <Input placeholder={FORM.NAME_PLACEHOLDER} />
      </Form.Item>
      <Form.Item
        name="description"
        label={FORM.DESCRIPTION_LABEL}
        style={{ marginBottom: 12 }}
        className={FORM_ITEM_CLASS}
      >
        <Input placeholder={FORM.DESCRIPTION_PLACEHOLDER} />
      </Form.Item>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Form.Item
          name="severity"
          label={FORM.SEVERITY_LABEL}
          style={{ marginBottom: 0 }}
          className={FORM_ITEM_CLASS}
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
          style={{ marginBottom: 0 }}
          className={FORM_ITEM_CLASS}
        >
          <Input type="number" min={0} placeholder="e.g. 1" />
        </Form.Item>
        <Form.Item
          name="mode"
          label={FORM.MODE_LABEL}
          style={{ marginBottom: 0 }}
          className={FORM_ITEM_CLASS}
        >
          <Radio.Group>
            <ConfigProvider theme={{ token: { colorPrimary: DEFAULT_COLORS.SUCCESS } }}>
              <Space direction="vertical" size={4}>
                {PPC.CREATE_PAGE.MODE_OPTIONS.map((o) => (
                  <Radio key={o.value} value={o.value} style={{ fontSize: 13 }}>
                    {o.label}
                  </Radio>
                ))}
              </Space>
            </ConfigProvider>
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  </SectionCard>
);

export default BasicInfoSection;
