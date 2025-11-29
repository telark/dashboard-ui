import React from 'react';
import { Form, Input } from 'antd';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';
import LabeledSelect from '../../../../../../components/display/inputs/LabeledSelect';
import { GROUPS_CONSTANTS as GC } from '../../../constants';

interface GroupFormFieldsProps {
  nameValidator: (rule: unknown, value: string) => Promise<void>;
  normalizeName: (value: string) => string;
  categoryOptions: Array<{ label: string; value: string }>;
}

const GroupFormFields: React.FC<GroupFormFieldsProps> = ({
  nameValidator,
  normalizeName,
  categoryOptions,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
        style={{ marginBottom: 18 }}
        className="form-item-compact"
        validateTrigger="onChange"
      >
        <Input placeholder={GC.LABELS.FORM.FIELDS.NAME_PLACEHOLDER} allowClear />
      </Form.Item>
      <LabeledInput
        name="description"
        label={GC.LABELS.FORM.FIELDS.DESCRIPTION_LABEL}
        required
        placeholder={GC.LABELS.FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
        marginBottom={18}
      />
      <LabeledSelect
        name="categoryID"
        label={GC.LABELS.FORM.FIELDS.CATEGORY_LABEL}
        placeholder={GC.LABELS.FORM.FIELDS.CATEGORY_PLACEHOLDER}
        required
        options={categoryOptions}
        marginBottom={6}
      />
    </div>
  );
};

export default GroupFormFields;

