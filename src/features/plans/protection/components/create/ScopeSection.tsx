import React from 'react';
import { Form, Select } from 'antd';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { ScopeType } from '../../models';
import type { SelectOption, SelectOptionGroup } from '../../hooks/useScopeExclusionOptions';
import Section from '../../../../../components/display/sections/Section';
import { FORM_ITEM_CLASS } from './types';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;

const filterByLabel = (input: string, option?: { label?: React.ReactNode }): boolean =>
  String(option?.label ?? '')
    .toLowerCase()
    .includes(input.toLowerCase());

interface ScopeSectionProps {
  scopeType: ScopeType;
  applicationOptions: { value: string; label: string }[];
  applicationsLoading: boolean;
  namespaceOptions: string[];
  namespacesLoading: boolean;
  onScopeTypeChange: () => void;
  scopeTypeDisabled?: boolean;
  disabled?: boolean;
  kindOptions: SelectOption[];
  resourceOptions: SelectOptionGroup[];
  resourcesLoading: boolean;
  exclusionsHint?: string;
}

const ScopeSection: React.FC<ScopeSectionProps> = ({
  scopeType,
  applicationOptions,
  applicationsLoading,
  namespaceOptions,
  namespacesLoading,
  onScopeTypeChange,
  scopeTypeDisabled = false,
  disabled = false,
  kindOptions,
  resourceOptions,
  resourcesLoading,
  exclusionsHint,
}) => {
  const kindsSelect = (
    <Select
      mode="multiple"
      allowClear
      placeholder={FORM.EXCLUDED_KINDS_PLACEHOLDER}
      style={{ width: '100%' }}
      disabled={disabled}
      options={kindOptions}
      filterOption={filterByLabel}
    />
  );

  return (
    <Section
      title={SECTIONS.SCOPE_TITLE}
      subtitle={SECTIONS.SCOPE_DESCRIPTION}
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Form.Item
            name="scopeType"
            label={FORM.SCOPE_TYPE_LABEL}
            style={{ marginBottom: 12 }}
            className={FORM_ITEM_CLASS}
          >
            <Select
              options={PPC.CREATE_PAGE.SCOPE_TYPE_OPTIONS}
              style={{ width: '100%' }}
              onChange={onScopeTypeChange}
              disabled={scopeTypeDisabled || disabled}
            />
          </Form.Item>

          {scopeType === 'applications' && (
            <>
              <Form.Item
                name="applicationRefs"
                label={FORM.APPLICATIONS_LABEL}
                rules={[{ required: true, message: FORM.APPLICATIONS_REQUIRED_ERROR }]}
                style={{ marginBottom: 12 }}
                className={FORM_ITEM_CLASS}
              >
                <Select
                  mode="multiple"
                  placeholder={FORM.APPLICATIONS_PLACEHOLDER}
                  style={{ width: '100%' }}
                  loading={applicationsLoading}
                  disabled={disabled}
                  options={applicationOptions}
                  filterOption={filterByLabel}
                />
              </Form.Item>
              <Form.Item
                name="excludedKinds"
                label={FORM.EXCLUDED_KINDS_LABEL}
                style={{ marginBottom: 12 }}
                className={FORM_ITEM_CLASS}
              >
                {kindsSelect}
              </Form.Item>
              <Form.Item
                name="excludedResources"
                label={FORM.EXCLUDED_RESOURCES_LABEL}
                style={{ marginBottom: 0 }}
                className={FORM_ITEM_CLASS}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder={exclusionsHint ?? FORM.EXCLUDED_RESOURCES_PLACEHOLDER}
                  style={{ width: '100%' }}
                  loading={resourcesLoading}
                  disabled={disabled}
                  options={resourceOptions}
                  filterOption={filterByLabel}
                />
              </Form.Item>
            </>
          )}

          {scopeType === 'namespaces' && (
            <>
              <Form.Item
                name="namespaces"
                label={FORM.NAMESPACES_LABEL}
                rules={[{ required: true, message: FORM.NAMESPACES_REQUIRED_ERROR }]}
                style={{ marginBottom: 12 }}
                className={FORM_ITEM_CLASS}
              >
                <Select
                  mode="multiple"
                  placeholder={FORM.NAMESPACES_PLACEHOLDER}
                  style={{ width: '100%' }}
                  loading={namespacesLoading}
                  disabled={disabled}
                  options={namespaceOptions.map((n) => ({ value: n, label: n }))}
                  filterOption={filterByLabel}
                />
              </Form.Item>
              <Form.Item
                name="excludedKinds"
                label={FORM.EXCLUDED_KINDS_LABEL}
                extra={FORM.EXCLUSIONS_NAMESPACES_HINT}
                style={{ marginBottom: 0 }}
                className={FORM_ITEM_CLASS}
              >
                {kindsSelect}
              </Form.Item>
            </>
          )}
        </div>
      }
    />
  );
};

export default ScopeSection;
