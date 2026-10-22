import React from 'react';
import { Form, Input } from 'antd';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import CategorySelect from './CategorySelect';
import type { AssignmentSelectOption } from '../../../../roles/models';
import { SPACING } from '../../../../../../constants';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.NONE }}>
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
        style={{ marginBottom: SPACING.LG }}
        className="form-item-compact no-asterisk"
        validateTrigger="onChange"
      >
        <Input placeholder={GC.LABELS.FORM.FIELDS.NAME_PLACEHOLDER} allowClear />
      </Form.Item>
      <LabeledInput
        name="description"
        label={GC.LABELS.FORM.FIELDS.DESCRIPTION_LABEL}
        required
        placeholder={GC.LABELS.FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
        marginBottom={16}
      />
      <Form.Item
        name="categoryRef"
        label={GC.LABELS.FORM.FIELDS.CATEGORY_LABEL}
        required
        rules={[
          {
            required: true,
            message: `Please select ${GC.LABELS.FORM.FIELDS.CATEGORY_LABEL.toLowerCase()}`,
          },
        ]}
        style={{ marginBottom: SPACING.NONE }}
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
  );
};

export default GroupFormFields;
