import React from 'react';
import { Form, Select } from 'antd';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { ScopeType } from '../../models';
import SectionCard from './SectionCard';
import { FORM_ITEM_CLASS } from './types';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;

interface ScopeSectionProps {
  scopeType: ScopeType;
  applicationOptions: { value: string; label: string }[];
  applicationsLoading: boolean;
  namespaceOptions: string[];
  namespacesLoading: boolean;
  onScopeTypeChange: () => void;
}

const ScopeSection: React.FC<ScopeSectionProps> = ({
  scopeType,
  applicationOptions,
  applicationsLoading,
  namespaceOptions,
  namespacesLoading,
  onScopeTypeChange,
}) => (
  <SectionCard title={SECTIONS.SCOPE_TITLE} description={SECTIONS.SCOPE_DESCRIPTION}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Form.Item
        name="scopeType"
        label={FORM.SCOPE_TYPE_LABEL}
        style={{ marginBottom: 12 }}
        className={FORM_ITEM_CLASS}
      >
        <Select
          options={PPC.CREATE_PAGE.SCOPE_TYPE_OPTIONS}
          style={{ width: 200 }}
          onChange={onScopeTypeChange}
        />
      </Form.Item>

      {scopeType === 'applications' && (
        <Form.Item
          name="applicationIds"
          label={FORM.APPLICATIONS_LABEL}
          rules={[{ required: true, message: 'Select at least one application' }]}
          style={{ marginBottom: 0 }}
          className={FORM_ITEM_CLASS}
        >
          <Select
            mode="multiple"
            placeholder={FORM.APPLICATIONS_PLACEHOLDER}
            style={{ width: '100%' }}
            loading={applicationsLoading}
            options={applicationOptions}
            filterOption={(input, option) =>
              String(option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
      )}

      {scopeType === 'namespaces' && (
        <Form.Item
          name="namespaces"
          label={FORM.NAMESPACES_LABEL}
          rules={[{ required: true, message: 'Select at least one namespace' }]}
          style={{ marginBottom: 0 }}
          className={FORM_ITEM_CLASS}
        >
          <Select
            mode="multiple"
            placeholder={FORM.NAMESPACES_PLACEHOLDER}
            style={{ width: '100%' }}
            loading={namespacesLoading}
            options={namespaceOptions.map((n) => ({ value: n, label: n }))}
            filterOption={(input, option) =>
              String(option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
      )}
    </div>
  </SectionCard>
);

export default ScopeSection;
