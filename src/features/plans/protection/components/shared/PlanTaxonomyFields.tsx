import React from 'react';
import { Form, Select } from 'antd';
import {
  PLAN_APPROVAL,
  PLAN_TAXONOMY_LIMITS,
  PROTECTION_PLANS_CONSTANTS as PPC,
} from '../../constants/protectionPlans';
import type { PlanApprovalMode } from '../../models';
import { FORM_ITEM_CLASS } from '../create/types';

const { FORM } = PPC.CREATE_PAGE;

interface PlanTaxonomyFieldsProps {
  environmentOptions: { value: string; label: string }[];
  tagOptions: { value: string; label: string }[];
  editMode?: boolean;
}

const deriveApprovalMode = (environmentID?: string): PlanApprovalMode =>
  environmentID === PLAN_APPROVAL.PRODUCTION_ENVIRONMENT_ID ? 'required' : 'automatic';

const PlanTaxonomyFields: React.FC<PlanTaxonomyFieldsProps> = ({
  environmentOptions,
  tagOptions,
  editMode = false,
}) => {
  const form = Form.useFormInstance();

  // Re-derive only on a user environment change, so a seeded duplicate keeps its source mode.
  const handleEnvironmentChange = (next?: string) => {
    if (editMode || form.isFieldsTouched(['approvalMode'])) return;
    form.setFieldValue('approvalMode', deriveApprovalMode(next));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
      <Form.Item
        name="environmentID"
        label={FORM.ENVIRONMENT_LABEL}
        style={{ marginBottom: 0 }}
        className={FORM_ITEM_CLASS}
      >
        <Select
          allowClear
          placeholder={FORM.ENVIRONMENT_PLACEHOLDER}
          options={environmentOptions}
          onChange={handleEnvironmentChange}
        />
      </Form.Item>
      <Form.Item
        name="tagIDs"
        label={FORM.TAGS_LABEL}
        style={{ marginBottom: 0 }}
        className={FORM_ITEM_CLASS}
      >
        <Select
          mode="multiple"
          allowClear
          optionFilterProp="label"
          maxCount={PLAN_TAXONOMY_LIMITS.MAX_TAGS}
          placeholder={FORM.TAGS_PLACEHOLDER}
          options={tagOptions}
        />
      </Form.Item>
    </div>
  );
};

export default PlanTaxonomyFields;
