import React from 'react';
import { Form } from 'antd';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';
import LabeledSelect from '../../../../../../components/display/inputs/LabeledSelect';
import Section from '../../../../../../components/display/sections/Section';
import AvatarPicker from '../../../../../../components/display/avatars/AvatarPicker';
import { USERS_CONSTANTS as UC } from '../../../constants';

interface UserFormFieldsProps {
  roleOptions: Array<{ label: string; value: string }>;
  groupOptions: Array<{ label: string; value: string }>;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ roleOptions, groupOptions }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section
        title={UC.LABELS.FORM.SECTIONS.USER_DETAILS}
        content={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Form.Item
              name="avatar"
              label={UC.LABELS.FORM.FIELDS.AVATAR_LABEL}
              style={{ marginBottom: 16 }}
              className="form-item-compact no-asterisk"
            >
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.avatar !== currentValues.avatar
                }
              >
                {({ getFieldValue, setFieldValue }) => {
                  const value = getFieldValue('avatar');
                  return (
                    <AvatarPicker
                      value={value}
                      onChange={(avatar) => setFieldValue('avatar', avatar)}
                      size={40}
                    />
                  );
                }}
              </Form.Item>
            </Form.Item>
            <LabeledInput
              name="username"
              label={UC.LABELS.FORM.FIELDS.USERNAME_LABEL}
              required
              placeholder={UC.LABELS.FORM.FIELDS.USERNAME_PLACEHOLDER}
              marginBottom={16}
            />
            <LabeledInput
              name="fullname"
              label={UC.LABELS.FORM.FIELDS.FULLNAME_LABEL}
              required
              placeholder={UC.LABELS.FORM.FIELDS.FULLNAME_PLACEHOLDER}
              marginBottom={16}
            />
            <LabeledInput
              name="email"
              label={UC.LABELS.FORM.FIELDS.EMAIL_LABEL}
              required
              placeholder={UC.LABELS.FORM.FIELDS.EMAIL_PLACEHOLDER}
              marginBottom={0}
            />
          </div>
        }
      />

      <Section
        title={UC.LABELS.FORM.SECTIONS.ASSIGNMENT}
        content={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <LabeledSelect
              name="roleID"
              label={UC.LABELS.FORM.FIELDS.ROLE_LABEL}
              placeholder={UC.LABELS.FORM.FIELDS.ROLE_PLACEHOLDER}
              required
              options={roleOptions}
              marginBottom={16}
            />
            <LabeledSelect
              name="groupID"
              label={UC.LABELS.FORM.FIELDS.GROUP_LABEL}
              placeholder={UC.LABELS.FORM.FIELDS.GROUP_PLACEHOLDER}
              required={false}
              options={groupOptions}
              marginBottom={0}
            />
          </div>
        }
      />
    </div>
  );
};

export default UserFormFields;
