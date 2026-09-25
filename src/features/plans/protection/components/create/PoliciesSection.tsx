import React from 'react';
import { Form, Select, Spin, Typography } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanTemplate } from '../../models';
import Section from '../../../../../components/display/sections/Section';
import type { PolicyEntry } from './types';
import { FORM_ITEM_CLASS } from './types';

const { SECTIONS, FORM } = PPC.CREATE_PAGE;

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
        <Spin size="small" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Form.Item
            name="mode"
            label={FORM.MODE_LABEL}
            style={{ marginBottom: 0 }}
            className={FORM_ITEM_CLASS}
          >
            <Select
              options={PPC.CREATE_PAGE.MODE_OPTIONS}
              style={{ width: '100%' }}
              disabled={disabled}
            />
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
              options={availableTemplates.map((t) => ({ value: t.id, label: t.name }))}
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
                    border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <span
                    style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 8 }}
                  >
                    {tpl.name}
                  </span>
                  {(tpl.params ?? []).map((param) => (
                    <div key={param.key} style={{ marginTop: 8 }}>
                      <Typography.Text
                        style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}
                      >
                        {param.label}
                        {param.required && (
                          <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
                        )}
                      </Typography.Text>
                      <Select
                        mode="tags"
                        placeholder={param.placeholder ?? `Enter ${param.label.toLowerCase()}`}
                        value={entry.params[param.key] ?? []}
                        onChange={(vals: string[]) =>
                          onPolicyParamChange(policyIndex, param.key, vals)
                        }
                        style={{ width: '100%' }}
                        tokenSeparators={[',']}
                        disabled={disabled}
                      />
                      {param.description && (
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 11, display: 'block', marginTop: 2 }}
                        >
                          {param.description}
                        </Typography.Text>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      )
    }
  />
);

export default PoliciesSection;
