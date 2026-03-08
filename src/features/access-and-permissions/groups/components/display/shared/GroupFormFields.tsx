import React from 'react';
import { Form, Input } from 'antd';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';
import Section from '../../../../../../components/display/sections/Section';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import { DEFAULT_COLORS } from '../../../../../../constants';
import UsersSelect from './UsersSelect';
import CategorySelect from './CategorySelect';
import type { AssignmentSelectOption } from '../../../../roles/models';

interface GroupFormFieldsProps {
  nameValidator: (rule: unknown, value: string) => Promise<void>;
  normalizeName: (value: string) => string;
  categoryOptions: AssignmentSelectOption[];
}

const GroupFormFields: React.FC<GroupFormFieldsProps> = ({
  nameValidator,
  normalizeName,
  categoryOptions,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Basic Details Section */}
      <Section
        title={GC.LABELS.FORM.SECTIONS.BASIC_DETAILS}
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
                  border: `1px solid ${DEFAULT_COLORS.BORDER_DEFAULT}`,
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
            <Form.Item
              name="categoryID"
              label={GC.LABELS.FORM.FIELDS.CATEGORY_LABEL}
              required
              rules={[
                {
                  required: true,
                  message: `Please select ${GC.LABELS.FORM.FIELDS.CATEGORY_LABEL.toLowerCase()}`,
                },
              ]}
              style={{ marginBottom: 0 }}
              className="form-item-compact no-asterisk"
            >
              <CategorySelect
                placeholder={GC.LABELS.FORM.FIELDS.CATEGORY_PLACEHOLDER}
                options={categoryOptions}
                filterOption={(input, option) => {
                  const displayName = option?.displayName || '';
                  return displayName.toLowerCase().includes(input.toLowerCase());
                }}
              />
            </Form.Item>
          </div>
        }
      />

      {/* Members Section */}
      <Section
        title={GC.LABELS.FORM.SECTIONS.MEMBERS}
        content={
          <Form.Item
            name="assignedUsersIDs"
            label={GC.LABELS.FORM.FIELDS.ASSIGNED_USERS_LABEL}
            required={false}
            style={{ marginBottom: 0 }}
            className="form-item-compact no-asterisk"
            normalize={(value) => (Array.isArray(value) ? value : [])}
          >
            <UsersSelect />
          </Form.Item>
        }
      />
    </div>
  );
};

export default GroupFormFields;
