import React, { memo, useMemo } from 'react';
import { Form } from 'antd';
import { LabeledSelect } from '../../../../components/display/inputs';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';

const { SCOPE_TITLE, SCOPE_DESCRIPTION } = PPC.CREATE_PAGE.SECTIONS;
const {
  SCOPE_TYPE_LABEL,
  SCOPE_TYPE_NAMESPACE,
  SCOPE_TYPE_RESOURCE,
  SCOPE_TYPE_PLACEHOLDER,
  NAMESPACE_LABEL,
  NAMESPACE_PLACEHOLDER,
  RESOURCE_NAME_LABEL,
  RESOURCE_NAME_PLACEHOLDER,
} = PPC.CREATE_PAGE.FORM;
const { NAMESPACE_OPTIONS, RESOURCE_NAME_OPTIONS } = PPC.CREATE_PAGE;

const SCOPE_TYPE_OPTIONS = [
  { value: 'namespace', label: SCOPE_TYPE_NAMESPACE },
  { value: 'resource', label: SCOPE_TYPE_RESOURCE },
];

const ScopeSection: React.FC = memo(() => {
  const scopeTypeOptions = useMemo(() => SCOPE_TYPE_OPTIONS, []);

  return (
    <SectionCard title={SCOPE_TITLE} description={SCOPE_DESCRIPTION}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Form.Item noStyle dependencies={['scope.scopeType']}>
          {({ getFieldValue }) => {
            const scopeType = getFieldValue('scope.scopeType');
            const isResource = scopeType === 'resource';

            return (
              <>
                <LabeledSelect
                  name="scope.scopeType"
                  label={SCOPE_TYPE_LABEL}
                  options={scopeTypeOptions}
                  placeholder={SCOPE_TYPE_PLACEHOLDER}
                  required
                  marginBottom={12}
                  allowClear={false}
                />
                <LabeledSelect
                  name="scope.namespace"
                  label={NAMESPACE_LABEL}
                  options={NAMESPACE_OPTIONS}
                  placeholder={NAMESPACE_PLACEHOLDER}
                  required
                  marginBottom={isResource ? 12 : 0}
                  allowClear={false}
                />
                {isResource && (
                  <LabeledSelect
                    name="scope.resourceName"
                    label={RESOURCE_NAME_LABEL}
                    options={RESOURCE_NAME_OPTIONS}
                    placeholder={RESOURCE_NAME_PLACEHOLDER}
                    required
                    marginBottom={0}
                    allowClear={false}
                  />
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
