import React from 'react';
import { Form, Select } from 'antd';
import {
  PLAN_TAXONOMY_LIMITS,
  PROTECTION_PLANS_CONSTANTS as PPC,
} from '../../constants/protectionPlans';
import { FORM_ITEM_CLASS } from '../create/types';

const { FORM } = PPC.CREATE_PAGE;

interface PlanTaxonomyFieldsProps {
  environmentOptions: { value: string; label: string }[];
  tagOptions: { value: string; label: string }[];
}

const PlanTaxonomyFields: React.FC<PlanTaxonomyFieldsProps> = ({
  environmentOptions,
  tagOptions,
}) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
    <Form.Item
      name="environmentID"
      label={FORM.ENVIRONMENT_LABEL}
      style={{ marginBottom: 0 }}
      className={FORM_ITEM_CLASS}
    >
      <Select allowClear placeholder={FORM.ENVIRONMENT_PLACEHOLDER} options={environmentOptions} />
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

export default PlanTaxonomyFields;
