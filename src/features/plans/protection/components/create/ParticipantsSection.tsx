import React from 'react';
import { Form, Select } from 'antd';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { ATTACHED_MEMBERS_CONSTANTS as AMC } from '../../../../access-and-permissions/groups/constants';
import type { User } from '../../../../access-and-permissions/users/models';
import UserAvatar from '../../../../../components/display/avatars/UserAvatar';
import SectionCard from './SectionCard';
import { FORM_ITEM_CLASS } from './types';

const { FORM } = PPC.CREATE_PAGE;

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
  <SectionCard title="Participants" description="Select users to associate with this plan.">
    <Form.Item
      name="participantsIDs"
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
        optionRender={(option) => {
          const u = userMap.get(String(option.value));
          return (
            <div style={AMC.LIST.MEMBER_CONTENT}>
              <div style={AMC.LIST.MEMBER_AVATAR_CONTAINER}>
                <UserAvatar avatar={u?.avatar} username={u?.username} size={32} />
              </div>
              <div style={AMC.LIST.MEMBER_INFO}>
                <div style={AMC.LIST.MEMBER_NAME}>{u?.username}</div>
                {u?.email && <div style={AMC.LIST.MEMBER_EMAIL}>{u.email}</div>}
              </div>
            </div>
          );
        }}
        filterOption={(input, option) =>
          String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    </Form.Item>
  </SectionCard>
);

export default ParticipantsSection;
