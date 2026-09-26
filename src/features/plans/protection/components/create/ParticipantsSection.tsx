import React from 'react';
import { Form, Select } from 'antd';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { User } from '../../../../access-and-permissions/users/models';
import { UserOptionRow } from '../../../../../components/display/users';
import Section from '../../../../../components/display/sections/Section';
import { FORM_ITEM_CLASS } from './types';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;

interface ParticipantsSectionProps {
  userOptions: { value: string; label: string }[];
  userMap: Map<string, User>;
  usersLoading: boolean;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
  userOptions,
  userMap,
  usersLoading,
}) => (
  <Section
    title={SECTIONS.PARTICIPANTS_TITLE}
    subtitle={SECTIONS.PARTICIPANTS_DESCRIPTION}
    content={
      <Form.Item
        name="participantRefs"
        label={FORM.PARTICIPANTS_LABEL}
        style={{ marginBottom: 0 }}
        className={FORM_ITEM_CLASS}
      >
        <Select
          mode="multiple"
          loading={usersLoading}
          placeholder={FORM.PARTICIPANTS_PLACEHOLDER}
          style={{ width: '100%' }}
          options={userOptions}
          labelRender={({ label, value }) => label ?? userMap.get(String(value))?.username ?? value}
          optionRender={(option) => (
            <UserOptionRow
              user={userMap.get(String(option.value))}
              displayName={String(option.label ?? '')}
            />
          )}
          filterOption={(input, option) =>
            String(option?.label ?? '')
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        />
      </Form.Item>
    }
  />
);

export default ParticipantsSection;
