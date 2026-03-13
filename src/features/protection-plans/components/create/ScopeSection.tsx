import React, { memo, useMemo } from 'react';
import { Form, Select, Typography } from 'antd';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';

const { SCOPE_TITLE, SCOPE_DESCRIPTION } = PPC.CREATE_PAGE.SECTIONS;
const FORM = PPC.CREATE_PAGE.FORM;
const { NAMESPACE_OPTIONS, RESOURCE_NAME_OPTIONS } = PPC.CREATE_PAGE;

const SCOPE_TYPE_OPTIONS = [
  { value: 'full_namespace', label: FORM.SCOPE_TYPE_FULL_NAMESPACE },
  { value: 'namespace_with_exclusions', label: FORM.SCOPE_TYPE_NAMESPACE_WITH_EXCLUSIONS },
  { value: 'selected_resources_only', label: FORM.SCOPE_TYPE_SELECTED_RESOURCES },
];

const SCOPE_TYPE_HINTS: Record<string, string> = {
  full_namespace: FORM.SCOPE_TYPE_FULL_NAMESPACE_HINT,
  namespace_with_exclusions: FORM.SCOPE_TYPE_NAMESPACE_WITH_EXCLUSIONS_HINT,
  selected_resources_only: FORM.SCOPE_TYPE_SELECTED_RESOURCES_HINT,
};

const FORM_ITEM_CLASS = 'form-item-compact no-asterisk';

const ScopeSection: React.FC = memo(() => {
  const scopeTypeOptions = useMemo(() => SCOPE_TYPE_OPTIONS, []);

  return (
    <SectionCard title={SCOPE_TITLE} description={SCOPE_DESCRIPTION}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Form.Item noStyle dependencies={['scope.scopeType']}>
          {({ getFieldValue }) => {
            const scopeType = getFieldValue('scope.scopeType');
            const showExclusions = scopeType === 'namespace_with_exclusions';
            const showIncludedOnly = scopeType === 'selected_resources_only';
            const hint = scopeType ? SCOPE_TYPE_HINTS[scopeType] : null;

            return (
              <>
                <Form.Item
                  name="scope.scopeType"
                  label={FORM.SCOPE_TYPE_LABEL}
                  rules={[
                    {
                      required: true,
                      message: `Please select ${FORM.SCOPE_TYPE_LABEL.toLowerCase()}`,
                    },
                  ]}
                  required
                  style={{ marginBottom: hint ? 4 : 12 }}
                  className={FORM_ITEM_CLASS}
                >
                  <Select
                    placeholder={FORM.SCOPE_TYPE_PLACEHOLDER}
                    options={scopeTypeOptions}
                    allowClear={false}
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentElement ?? document.body}
                  />
                </Form.Item>
                {hint && (
                  <Typography.Text
                    type="secondary"
                    style={{ display: 'block', fontSize: 12, marginBottom: 12 }}
                  >
                    {hint}
                  </Typography.Text>
                )}
                <Form.Item
                  name="scope.namespaces"
                  label={FORM.NAMESPACE_LABEL}
                  rules={[
                    {
                      required: true,
                      message: `Please select ${FORM.NAMESPACE_LABEL.toLowerCase()}`,
                    },
                  ]}
                  required
                  style={{ marginBottom: showExclusions || showIncludedOnly ? 12 : 0 }}
                  className={FORM_ITEM_CLASS}
                >
                  <Select
                    placeholder={FORM.NAMESPACE_PLACEHOLDER}
                    options={NAMESPACE_OPTIONS}
                    allowClear={false}
                    mode="multiple"
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentElement ?? document.body}
                  />
                </Form.Item>
                {showExclusions && (
                  <Form.Item
                    name="scope.excludedResources"
                    label={FORM.EXCLUDED_RESOURCES_LABEL}
                    style={{ marginBottom: 0 }}
                    className={FORM_ITEM_CLASS}
                  >
                    <Select
                      placeholder={FORM.EXCLUDED_RESOURCES_PLACEHOLDER}
                      options={RESOURCE_NAME_OPTIONS}
                      allowClear
                      mode="multiple"
                      style={{ width: '100%' }}
                      getPopupContainer={(node) => node.parentElement ?? document.body}
                    />
                  </Form.Item>
                )}
                {showIncludedOnly && (
                  <Form.Item
                    name="scope.includedResources"
                    label={FORM.INCLUDED_RESOURCES_LABEL}
                    rules={[
                      {
                        required: true,
                        message: `Please select ${FORM.INCLUDED_RESOURCES_LABEL.toLowerCase()}`,
                      },
                    ]}
                    required
                    style={{ marginBottom: 0 }}
                    className={FORM_ITEM_CLASS}
                  >
                    <Select
                      placeholder={FORM.INCLUDED_RESOURCES_PLACEHOLDER}
                      options={RESOURCE_NAME_OPTIONS}
                      allowClear={false}
                      mode="multiple"
                      style={{ width: '100%' }}
                      getPopupContainer={(node) => node.parentElement ?? document.body}
                    />
                  </Form.Item>
                )}
              </>
            );
          }}
        </Form.Item>
      </div>
    </SectionCard>
  );
});

ScopeSection.displayName = 'ScopeSection';

export default ScopeSection;
