import React from 'react';
import { Form, Input, Select } from 'antd';
import Section from '../../shared/Section';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../constants/pages/roles';
import type { RolesGeneralSectionProps } from '../../../interfaces/roles';

const RolesGeneralSection: React.FC<RolesGeneralSectionProps> = ({ form }) => {
  return (
    <Section title={RPC.GENERAL.TITLE} subtitle={RPC.GENERAL.SUBTITLE}>
      <Form.Item
        label="Role Name"
        name="name"
        rules={[{ required: true, message: 'Please enter a role name' }]}
        style={{ marginBottom: 6 }}
      >
        <Input placeholder="e.g. Platform Admin" allowClear />
      </Form.Item>

      <Form.Item
        label="Assigned to Group"
        name="group"
        rules={[{ required: true, message: 'Please select a group' }]}
        style={{ marginBottom: 6 }}
      >
        <Select options={RPC.GENERAL.GROUP_OPTIONS as any} placeholder="Select a group" />
      </Form.Item>
    </Section>
  );
};

export default RolesGeneralSection;


