import React, { memo, useMemo } from 'react';
import { Form, Select, Tag, Typography } from 'antd';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { useScopeOptions } from '../../hooks/useScopeOptions';
import SectionCard from './SectionCard';

const { SCOPE_TITLE, SCOPE_DESCRIPTION } = PPC.CREATE_PAGE.SECTIONS;
const FORM = PPC.CREATE_PAGE.FORM;
const { WORKLOAD_KIND_OPTIONS, RESOURCE_KIND_OPTIONS } = PPC.CREATE_PAGE;

const SCOPE_TYPE_OPTIONS = [
  { value: 'namespace', label: FORM.SCOPE_TYPE_NAMESPACE },
  { value: 'workload', label: FORM.SCOPE_TYPE_WORKLOAD },
  { value: 'resource', label: FORM.SCOPE_TYPE_RESOURCE },
];

const SCOPE_TYPE_HINTS: Record<string, string> = {
  namespace: FORM.SCOPE_TYPE_NAMESPACE_HINT,
  workload: FORM.SCOPE_TYPE_WORKLOAD_HINT,
  resource: FORM.SCOPE_TYPE_RESOURCE_HINT,
};

const FORM_ITEM_CLASS = 'form-item-compact no-asterisk';

interface OptionWithNamespaceRenderProps {
  option: { label?: React.ReactNode; data?: { namespace?: string }; namespace?: string };
}

const OptionWithNamespaceRender: React.FC<OptionWithNamespaceRenderProps> = ({ option }) => {
  const ns = option.data?.namespace ?? option.namespace;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span>{option.label}</span>
      {ns != null && ns !== '' && <Tag>{ns}</Tag>}
    </span>
  );
};

const ScopeSection: React.FC = memo(() => {
  const scopeTypeOptions = useMemo(() => SCOPE_TYPE_OPTIONS, []);
  const { namespaceOptions, workloadOptions, resourceOptions, excludedOptions, loading } =
    useScopeOptions();

  const renderOptionWithNs = (opt: unknown) => {
    const o = opt as { label?: React.ReactNode; data?: { namespace?: string }; namespace?: string };
    return (
      <OptionWithNamespaceRender
        option={{
          label: o.label,
          data: o.data,
          namespace: o.namespace,
        }}
      />
    );
  };

  return (
    <SectionCard title={SCOPE_TITLE} description={SCOPE_DESCRIPTION}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Form.Item noStyle dependencies={['scope.scopeType']}>
          {({ getFieldValue }) => {
            const scopeType = getFieldValue('scope.scopeType');
            const isNamespace = scopeType === 'namespace';
            const isWorkload = scopeType === 'workload';
            const isResource = scopeType === 'resource';
            const hint = scopeType ? SCOPE_TYPE_HINTS[scopeType] : null;
            const showExclusions = isNamespace;
            const showWorkloadFields = isWorkload;
            const showResourceFields = isResource;

            const marginAfterNamespaces =
              showExclusions || showWorkloadFields || showResourceFields ? 12 : 0;

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
                  style={{ marginBottom: marginAfterNamespaces }}
                  className={FORM_ITEM_CLASS}
                >
                  <Select
                    placeholder={FORM.NAMESPACE_PLACEHOLDER}
                    options={namespaceOptions}
                    allowClear={false}
                    mode="multiple"
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentElement ?? document.body}
                    loading={loading}
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
                      options={excludedOptions}
                      optionRender={(opt) => renderOptionWithNs(opt)}
                      allowClear
                      mode="multiple"
                      style={{ width: '100%' }}
                      getPopupContainer={(node) => node.parentElement ?? document.body}
                      loading={loading}
                    />
                  </Form.Item>
                )}
                {showWorkloadFields && (
                  <>
                    <Form.Item
                      name="scope.workloadKind"
                      label={FORM.WORKLOAD_KIND_LABEL}
                      rules={[
                        {
                          required: true,
                          message: `Please select ${FORM.WORKLOAD_KIND_LABEL.toLowerCase()}`,
                        },
                      ]}
                      required
                      style={{ marginBottom: 12 }}
                      className={FORM_ITEM_CLASS}
                    >
                      <Select
                        placeholder={FORM.WORKLOAD_KIND_PLACEHOLDER}
                        options={WORKLOAD_KIND_OPTIONS}
                        allowClear={false}
                        style={{ width: '100%' }}
                        getPopupContainer={(node) => node.parentElement ?? document.body}
                      />
                    </Form.Item>
                    <Form.Item
                      name="scope.workloads"
                      label={FORM.WORKLOADS_LABEL}
                      rules={[
                        {
                          required: true,
                          message: `Please select ${FORM.WORKLOADS_LABEL.toLowerCase()}`,
                        },
                      ]}
                      required
                      style={{ marginBottom: 0 }}
                      className={FORM_ITEM_CLASS}
                    >
                      <Select
                        placeholder={FORM.WORKLOADS_PLACEHOLDER}
                        options={workloadOptions}
                        optionRender={(opt) => renderOptionWithNs(opt)}
                        allowClear={false}
                        mode="multiple"
                        style={{ width: '100%' }}
                        getPopupContainer={(node) => node.parentElement ?? document.body}
                        loading={loading}
                      />
                    </Form.Item>
                  </>
                )}
                {showResourceFields && (
                  <>
                    <Form.Item
                      name="scope.resourceKind"
                      label={FORM.RESOURCE_KIND_LABEL}
                      rules={[
                        {
                          required: true,
                          message: `Please select ${FORM.RESOURCE_KIND_LABEL.toLowerCase()}`,
                        },
                      ]}
                      required
                      style={{ marginBottom: 12 }}
                      className={FORM_ITEM_CLASS}
                    >
                      <Select
                        placeholder={FORM.RESOURCE_KIND_PLACEHOLDER}
                        options={RESOURCE_KIND_OPTIONS}
                        allowClear={false}
                        style={{ width: '100%' }}
                        getPopupContainer={(node) => node.parentElement ?? document.body}
                      />
                    </Form.Item>
                    <Form.Item
                      name="scope.resources"
                      label={FORM.RESOURCES_LABEL}
                      rules={[
                        {
                          required: true,
                          message: `Please select ${FORM.RESOURCES_LABEL.toLowerCase()}`,
                        },
                      ]}
                      required
                      style={{ marginBottom: 0 }}
                      className={FORM_ITEM_CLASS}
                    >
                      <Select
                        placeholder={FORM.RESOURCES_PLACEHOLDER}
                        options={resourceOptions}
                        optionRender={(opt) => renderOptionWithNs(opt)}
                        allowClear={false}
                        mode="multiple"
                        style={{ width: '100%' }}
                        getPopupContainer={(node) => node.parentElement ?? document.body}
                        loading={loading}
                      />
                    </Form.Item>
                  </>
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
