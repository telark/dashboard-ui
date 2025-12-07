import React from 'react';
import { Form, Input } from 'antd';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';
import LabeledSelect from '../../../../../../components/display/inputs/LabeledSelect';
import Section from '../../../../../../components/display/sections/Section';
import { GROUPS_CONSTANTS as GC } from '../../../constants';

interface GroupFormFieldsProps {
  nameValidator: (rule: unknown, value: string) => Promise<void>;
  normalizeName: (value: string) => string;
  categoryOptions: Array<{ label: string; value: string }>;
  userOptions: Array<{ label: string; value: string }>;
}

const GroupFormFields: React.FC<GroupFormFieldsProps> = ({
  nameValidator,
  normalizeName,
  categoryOptions,
  userOptions,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Basic Details Section */}
      <Section
        title="Basic Details"
        content={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Form.Item
              name="name"
              label={GC.LABELS.FORM.FIELDS.NAME_LABEL}
              required
              normalize={normalizeName}
              rules={[
                {
                  required: true,
                  message: `Please enter ${GC.LABELS.FORM.FIELDS.NAME_LABEL.toLowerCase()}`,
                },
                { validator: nameValidator },
              ]}
              style={{ marginBottom: 16 }}
              className="form-item-compact no-asterisk"
              validateTrigger={['onBlur', 'onSubmit']}
            >
              <Input
                placeholder={GC.LABELS.FORM.FIELDS.NAME_PLACEHOLDER}
                allowClear
                style={{
                  height: 36,
                  borderRadius: 8,
                  border: '1px solid #d9d9d9',
                  fontSize: 14,
                  padding: '0 12px',
                }}
              />
            </Form.Item>
            <LabeledInput
              name="description"
              label={GC.LABELS.FORM.FIELDS.DESCRIPTION_LABEL}
              required
              placeholder={GC.LABELS.FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
              marginBottom={16}
            />
            <LabeledSelect
              name="categoryID"
              label={GC.LABELS.FORM.FIELDS.CATEGORY_LABEL}
              placeholder={GC.LABELS.FORM.FIELDS.CATEGORY_PLACEHOLDER}
              required
              options={categoryOptions}
              marginBottom={0}
            />
          </div>
        }
      />

      {/* Members Section */}
      <Section
        title="Members"
        content={
          <LabeledSelect
            name="assignedUsersIDs"
            label="Assigned Users"
            placeholder="-Select users"
            required={false}
            options={userOptions}
            mode="multiple"
            marginBottom={0}
          />
        }
      />
    </div>
  );
};

export default GroupFormFields;
