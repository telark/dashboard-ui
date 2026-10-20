import React from 'react';
import { Alert, Form, Select, Typography } from 'antd';
import { DEFAULT_COLORS, DOCS_LINKS } from '../../../../../constants';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  POLICY_CHIP_LABEL,
} from '../../constants/protectionPlans';
import type { PlanTemplate } from '../../models';
import Section from '../../../../../components/display/sections/Section';
import { FancySpinner } from '../../../../../components/animation';
import type { PolicyEntry } from './types';
import { FORM_ITEM_CLASS } from './types';
import { paramError } from '../../utils/planFormValues';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;

// Backend template names say "Block …" even in audit mode, so the picker names the operation.
const templateLabel = (t: PlanTemplate): string => POLICY_CHIP_LABEL[t.id] ?? t.name;

interface PoliciesSectionProps {
  policies: PolicyEntry[];
  availableTemplates: PlanTemplate[];
  templates: PlanTemplate[];
  templatesLoading: boolean;
  onPoliciesChange: (policies: PolicyEntry[]) => void;
  onPolicyParamChange: (index: number, key: string, values: string[]) => void;
  disabled?: boolean;
}

const PoliciesSection: React.FC<PoliciesSectionProps> = ({
  policies,
  availableTemplates,
  templates,
  templatesLoading,
  onPoliciesChange,
  onPolicyParamChange,
  disabled = false,
}) => (
  <Section
    title={SECTIONS.POLICIES_TITLE}
    subtitle={SECTIONS.POLICIES_DESCRIPTION}
    content={
      templatesLoading ? (
        <FancySpinner size={14} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Form.Item
            name="mode"
            label={FORM.MODE_LABEL}
            style={{ marginBottom: 0 }}
            className={FORM_ITEM_CLASS}
            extra={
              <Typography.Link
                href={DOCS_LINKS.AUDIT_AND_ENFORCE.HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                {DOCS_LINKS.AUDIT_AND_ENFORCE.LABEL}
              </Typography.Link>
            }
          >
            <Select
              options={PPC.CREATE_PAGE.MODE_OPTIONS}
              style={{ width: '100%' }}
              disabled={disabled}
            />
          </Form.Item>
          <Form.Item noStyle dependencies={['mode']}>
            {({ getFieldValue }) =>
              getFieldValue('mode') === 'audit' && (
                <Alert type="warning" showIcon title={FORM.AUDIT_WARNING} />
              )
            }
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            className={FORM_ITEM_CLASS}
            validateStatus={policies.length === 0 ? 'error' : ''}
            help={policies.length === 0 ? FORM.POLICIES_REQUIRED_ERROR : undefined}
            required
          >
            <Select
              mode="multiple"
              placeholder={FORM.ADD_POLICY_BUTTON}
              style={{ width: '100%' }}
              value={policies.map((p) => p.templateID)}
              disabled={disabled}
              options={availableTemplates.map((t) => ({ value: t.id, label: templateLabel(t) }))}
              optionRender={(option) => (
                <div>
                  <div>{option.label}</div>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {templates.find((t) => t.id === option.value)?.description}
                  </Typography.Text>
                </div>
              )}
              onChange={(selectedIds: string[]) => {
                onPoliciesChange(
                  selectedIds.map((id) => {
                    const existing = policies.find((p) => p.templateID === id);
                    if (existing) return existing;
                    const tpl = templates.find((t) => t.id === id);
                    const initialParams: Record<string, string[]> = {};
                    tpl?.params?.forEach((p) => {
                      initialParams[p.key] = [];
                    });
                    return { templateID: id, params: initialParams };
                  }),
                );
              }}
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {policies
            .filter((entry) => {
              const tpl = templates.find((t) => t.id === entry.templateID);
              return (tpl?.params?.length ?? 0) > 0;
            })
            .map((entry) => {
              const tpl = templates.find((t) => t.id === entry.templateID);
              if (!tpl) return null;
              const policyIndex = policies.findIndex((p) => p.templateID === entry.templateID);
              return (
                <div
                  key={entry.templateID}
                  style={{
                    border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <span
                    style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 8 }}
                  >
                    {templateLabel(tpl)}
                  </span>
                  {(tpl.params ?? []).map((param) => {
                    const error = paramError(entry, param);
                    return (
                      <div key={param.key} style={{ marginTop: 8 }}>
                        <Typography.Text
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            display: 'block',
                            marginBottom: 4,
                          }}
                        >
                          {param.label}
                          {param.required && (
                            <span style={{ color: DEFAULT_COLORS.DANGER, marginLeft: 2 }}>*</span>
                          )}
                        </Typography.Text>
                        <Select
                          mode="tags"
                          placeholder={param.placeholder ?? FORM.PARAM_PLACEHOLDER(param.label)}
                          value={entry.params[param.key] ?? []}
                          onChange={(vals: string[]) =>
                            onPolicyParamChange(
                              policyIndex,
                              param.key,
                              vals.map((v) => v.trim()).filter(Boolean),
                            )
                          }
                          style={{ width: '100%' }}
                          tokenSeparators={[',']}
                          disabled={disabled}
                          status={error ? 'error' : undefined}
                        />
                        {error && (
                          <Typography.Text
                            type="danger"
                            style={{ fontSize: 11, display: 'block', marginTop: 2 }}
                          >
                            {error}
                          </Typography.Text>
                        )}
                        {param.description && (
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: 11, display: 'block', marginTop: 2 }}
                          >
                            {param.description}
                          </Typography.Text>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      )
    }
  />
);

export default PoliciesSection;
