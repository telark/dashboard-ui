import React from 'react';
import { Form } from 'antd';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';
import LabeledSelect from '../../../../../../components/display/inputs/LabeledSelect';
import AvatarPicker from '../../../../../../components/display/avatars/AvatarPicker';
import { USERS_CONSTANTS as UC } from '../../../constants';

interface UserFormFieldsProps {
  roleOptions: Array<{ label: string; value: string }>;
  groupOptions: Array<{ label: string; value: string }>;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ roleOptions, groupOptions }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <Form.Item
            name="avatar"
            label="Avatar"
            rules={[{ required: true, message: 'Please select an avatar' }]}
            style={{ marginBottom: 12 }}
            className="form-item-compact"
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
            marginBottom={12}
          />
          <LabeledInput
            name="fullname"
            label={UC.LABELS.FORM.FIELDS.FULLNAME_LABEL}
            required
            placeholder={UC.LABELS.FORM.FIELDS.FULLNAME_PLACEHOLDER}
            marginBottom={12}
          />
          <LabeledInput
            name="email"
            label={UC.LABELS.FORM.FIELDS.EMAIL_LABEL}
            required
            placeholder={UC.LABELS.FORM.FIELDS.EMAIL_PLACEHOLDER}
            marginBottom={0}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <LabeledSelect
            name="roleID"
            label={UC.LABELS.FORM.FIELDS.ROLE_LABEL}
            placeholder={UC.LABELS.FORM.FIELDS.ROLE_PLACEHOLDER}
            required
            options={roleOptions}
            marginBottom={12}
          />
          <LabeledSelect
            name="groupID"
            label={UC.LABELS.FORM.FIELDS.GROUP_LABEL}
            placeholder={UC.LABELS.FORM.FIELDS.GROUP_PLACEHOLDER}
            required
            options={groupOptions}
            marginBottom={0}
          />
        </div>
      </div>
    </div>
  );
};

export default UserFormFields;
