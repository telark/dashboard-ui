import React from 'react';
import { Form, Input } from 'antd';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import CategorySelect from './CategorySelect';
import type { AssignmentSelectOption } from '../../../../roles/models';
import { INPUT_LIMITS, SPACING } from '../../../../../../constants';
import { inputGuard } from '../../../../../../utils/helpers/inputGuard';

const nameGuard = inputGuard(INPUT_LIMITS.GROUP_NAME.MAX, {
  required: `Please enter ${GC.LABELS.FORM.FIELDS.NAME_LABEL.toLowerCase()}`,
});
// Not multiline: the API refuses line breaks in a group's description, so they're dropped here.
const descriptionGuard = inputGuard(INPUT_LIMITS.GROUP_DESCRIPTION.MAX, {
  required: `Please enter ${GC.LABELS.FORM.FIELDS.DESCRIPTION_LABEL.toLowerCase()}`,
});

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
        // sanitizeName keeps [a-zA-Z0-9_-] only, which already drops invisible characters.
        normalize={normalizeName}
        rules={[...nameGuard.rules, { validator: nameValidator }]}
        style={{ marginBottom: SPACING.LG }}
        className="form-item-compact no-asterisk"
        validateTrigger="onChange"
      >
        <Input
          {...nameGuard.input}
          placeholder={GC.LABELS.FORM.FIELDS.NAME_PLACEHOLDER}
          allowClear
        />
      </Form.Item>
      <Form.Item
        name="description"
        label={GC.LABELS.FORM.FIELDS.DESCRIPTION_LABEL}
        required
        normalize={descriptionGuard.normalize}
        rules={descriptionGuard.rules}
        style={{ marginBottom: SPACING.LG }}
        className="form-item-compact no-asterisk"
      >
        <Input.TextArea
          {...descriptionGuard.input}
          showCount
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder={GC.LABELS.FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
          // The counter sits beside the next field's label, so it needs no line of its own here.
          style={{ marginBottom: SPACING.NONE }}
        />
      </Form.Item>
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
