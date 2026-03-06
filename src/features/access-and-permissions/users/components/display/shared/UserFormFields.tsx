import React from 'react';
import { Form } from 'antd';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';
import Section from '../../../../../../components/display/sections/Section';
import AvatarPicker from '../../../../../../components/display/avatars/AvatarPicker';
import { USERS_CONSTANTS as UC } from '../../../constants';

interface UserFormFieldsProps {
  usernameRules?: any[];
  emailRules?: any[];
  fullnameRules?: any[];
}

const AVATAR_LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(0,0,0,0.65)',
  fontWeight: 500,
  minWidth: 40,
};

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  usernameRules = [],
  emailRules = [],
  fullnameRules = [],
}) => {
  return (
    <Section
      title={UC.LABELS.FORM.SECTIONS.USER_DETAILS}
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={AVATAR_LABEL_STYLE}>{UC.LABELS.FORM.FIELDS.AVATAR_LABEL}</span>
            <Form.Item name="avatar" noStyle>
              <AvatarPicker size={40} />
            </Form.Item>
          </div>
          <LabeledInput
            name="username"
            label={UC.LABELS.FORM.FIELDS.USERNAME_LABEL}
            required
            placeholder={UC.LABELS.FORM.FIELDS.USERNAME_PLACEHOLDER}
            marginBottom={16}
            rules={usernameRules}
            validateTrigger="onChange"
          />
          <LabeledInput
            name="fullname"
            label={UC.LABELS.FORM.FIELDS.FULLNAME_LABEL}
            required
            placeholder={UC.LABELS.FORM.FIELDS.FULLNAME_PLACEHOLDER}
            marginBottom={16}
            rules={fullnameRules}
            validateTrigger="onChange"
          />
          <LabeledInput
            name="email"
            label={UC.LABELS.FORM.FIELDS.EMAIL_LABEL}
            required
            placeholder={UC.LABELS.FORM.FIELDS.EMAIL_PLACEHOLDER}
            marginBottom={0}
            rules={emailRules}
            validateTrigger="onChange"
          />
        </div>
      }
    />
  );
};

export default UserFormFields;
