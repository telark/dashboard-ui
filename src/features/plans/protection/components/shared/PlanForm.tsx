import React, { useMemo } from 'react';
import { Alert, Form } from 'antd';
import type { FormInstance } from 'antd';
import { PrimaryButton } from '../../../../../components/display/buttons';
import { Icons } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import {
  BasicInfoSection,
  ScopeSection,
  PoliciesSection,
  ScheduleSection,
  ParticipantsSection,
} from '../create';
import type { FormValues, PolicyEntry } from '../create';
import type { PlanTemplate, ProtectionPlan } from '../../models';
import type { User } from '../../../../access-and-permissions/users/models';
import { scopeItemsChanged } from '../../utils/planFormValues';

const ProtectionPlansIcon = Icons.ProtectionPlans;

export interface PlanFormProps {
  form: FormInstance<FormValues>;
  initialValues: FormValues;
  policies: PolicyEntry[];
  onPoliciesChange: (next: PolicyEntry[]) => void;
  onPolicyParamChange: (index: number, key: string, values: string[]) => void;
  onSubmit: (values: FormValues) => void | Promise<void>;
  submitting: boolean;
  mode: 'create' | 'edit';
  plan?: ProtectionPlan;
  hideSubmitButton?: boolean;
  submitDisabled?: boolean;
  submitLabel: string;
  loadingLabel: string;
  templates: PlanTemplate[];
  templatesLoading: boolean;
  applicationOptions: { value: string; label: string }[];
  applicationsLoading: boolean;
  namespaceOptions: string[];
  namespacesLoading: boolean;
  userOptions: { value: string; label: string }[];
  userMap: Map<string, User>;
  usersLoading: boolean;
  submitError?: string | null;
  onSubmitErrorClose?: () => void;
  validateTrigger?: string | string[];
}

const PlanForm: React.FC<PlanFormProps> = ({
  form,
  initialValues,
  policies,
  onPoliciesChange,
  onPolicyParamChange,
  onSubmit,
  submitting,
  mode,
  plan,
  hideSubmitButton = false,
  submitDisabled = false,
  submitLabel,
  loadingLabel,
  templates,
  templatesLoading,
  applicationOptions,
  applicationsLoading,
  namespaceOptions,
  namespacesLoading,
  userOptions,
  userMap,
  usersLoading,
  submitError,
  onSubmitErrorClose,
  validateTrigger,
}) => {
  const isEditMode = mode === 'edit';
  const scopeType = Form.useWatch('scopeType', form) ?? initialValues.scopeType;
  const timeMode = Form.useWatch('timeMode', form) ?? initialValues.timeMode;

  const availableTemplates = useMemo(
    () => (!scopeType ? templates : templates.filter((t) => t.supportedScopes.includes(scopeType))),
    [templates, scopeType],
  );

  const handleScopeTypeChange = () => {
    form.resetFields(['applicationIds', 'namespaces']);
    onPoliciesChange([]);
  };

  const watchedValues = Form.useWatch([], form);
  const showActiveScopeWarning = useMemo(() => {
    if (!isEditMode || !plan || plan.phase !== 'active') return false;
    const current = (watchedValues ?? form.getFieldsValue(true)) as FormValues;
    return scopeItemsChanged(plan, current);
  }, [isEditMode, plan, watchedValues, form]);

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={initialValues}
      validateTrigger={validateTrigger}
      style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: PPC.CREATE_PAGE.GAP_BETWEEN_CARDS,
        }}
      >
        <BasicInfoSection />
        <ScopeSection
          scopeType={scopeType}
          applicationOptions={applicationOptions}
          applicationsLoading={applicationsLoading}
          namespaceOptions={namespaceOptions}
          namespacesLoading={namespacesLoading}
          onScopeTypeChange={handleScopeTypeChange}
          scopeTypeDisabled={isEditMode}
        />
        <PoliciesSection
          policies={policies}
          availableTemplates={availableTemplates}
          templates={templates}
          templatesLoading={templatesLoading}
          onPoliciesChange={onPoliciesChange}
          onPolicyParamChange={onPolicyParamChange}
        />
        <ScheduleSection timeMode={timeMode} isCreateMode={!isEditMode} />
        <ParticipantsSection
          userOptions={userOptions}
          userMap={userMap}
          usersLoading={usersLoading}
        />
      </div>

      {showActiveScopeWarning && (
        <Alert
          type="warning"
          showIcon
          title={PPC.PANELS.EDIT.ACTIVE_SCOPE_WARNING}
          style={{ marginTop: 16 }}
        />
      )}

      {submitError && (
        <Alert
          type="error"
          title={submitError}
          style={{ marginTop: 16 }}
          showIcon
          closable={Boolean(onSubmitErrorClose)}
          onClose={onSubmitErrorClose}
        />
      )}

      {!hideSubmitButton && (
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <PrimaryButton
            action={submitLabel}
            onClick={() => form.submit()}
            loading={submitting}
            loadingLabel={loadingLabel}
            icon={<ProtectionPlansIcon size={16} />}
            disabled={submitDisabled || submitting}
          />
        </div>
      )}
    </Form>
  );
};

export default PlanForm;
