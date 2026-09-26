import React, { useMemo } from 'react';
import { Alert, Form } from 'antd';
import type { FormInstance } from 'antd';
import { PrimaryButton } from '../../../../../components/display/buttons';
import Section from '../../../../../components/display/sections/Section';
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
import { isMaterialEditLocked } from '../../utils/phaseRules';
import { useScopeExclusionOptions } from '../../hooks/useScopeExclusionOptions';
import PlanTaxonomyFields from './PlanTaxonomyFields';
import PlanApprovalModeField from './PlanApprovalModeField';

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
  environmentOptions: { value: string; label: string }[];
  tagOptions: { value: string; label: string }[];
  submitError?: string | null;
  onSubmitErrorClose?: () => void;
  validateTrigger?: string | string[];
  nameValidator: (rule: unknown, value: string | undefined) => Promise<void>;
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
  environmentOptions,
  tagOptions,
  submitError,
  onSubmitErrorClose,
  validateTrigger,
  nameValidator,
}) => {
  const isEditMode = mode === 'edit';
  const materialLocked = isEditMode && plan !== undefined && isMaterialEditLocked(plan);
  const scopeType = Form.useWatch('scopeType', form) ?? initialValues.scopeType;
  const timeMode = Form.useWatch('timeMode', form) ?? initialValues.timeMode;
  const applicationIds = Form.useWatch('applicationIds', form) ?? [];
  const { kindOptions, resourceOptions, resourcesLoading } = useScopeExclusionOptions({
    scopeType,
    applicationIds,
  });

  const availableTemplates = useMemo(
    () => (!scopeType ? templates : templates.filter((t) => t.supportedScopes.includes(scopeType))),
    [templates, scopeType],
  );

  const handleScopeTypeChange = () => {
    form.resetFields(['applicationIds', 'namespaces', 'excludedKinds', 'excludedResources']);
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
        <BasicInfoSection nameValidator={nameValidator} />
        <Section
          title={PPC.CREATE_PAGE.SECTIONS.CLASSIFICATION_TITLE}
          subtitle={PPC.CREATE_PAGE.SECTIONS.CLASSIFICATION_DESCRIPTION}
          content={
            <PlanTaxonomyFields
              environmentOptions={environmentOptions}
              tagOptions={tagOptions}
              editMode={isEditMode}
            />
          }
        />
        <Section
          title={PPC.CREATE_PAGE.SECTIONS.APPROVAL_TITLE}
          subtitle={PPC.CREATE_PAGE.SECTIONS.APPROVAL_DESCRIPTION}
          content={<PlanApprovalModeField editMode={isEditMode} />}
        />
        <ScopeSection
          scopeType={scopeType}
          applicationOptions={applicationOptions}
          applicationsLoading={applicationsLoading}
          namespaceOptions={namespaceOptions}
          namespacesLoading={namespacesLoading}
          onScopeTypeChange={handleScopeTypeChange}
          scopeTypeDisabled={isEditMode}
          disabled={materialLocked}
          kindOptions={kindOptions}
          resourceOptions={resourceOptions}
          resourcesLoading={resourcesLoading}
          exclusionsHint={
            applicationIds.length === 0
              ? PPC.CREATE_PAGE.FORM.EXCLUSIONS_SELECT_APPS_HINT
              : undefined
          }
        />
        <PoliciesSection
          policies={policies}
          availableTemplates={availableTemplates}
          templates={templates}
          templatesLoading={templatesLoading}
          onPoliciesChange={onPoliciesChange}
          onPolicyParamChange={onPolicyParamChange}
          disabled={materialLocked}
        />
        <ScheduleSection timeMode={timeMode} isCreateMode={!isEditMode} disabled={materialLocked} />
        <ParticipantsSection
          userOptions={userOptions}
          userMap={userMap}
          usersLoading={usersLoading}
        />
      </div>

      {materialLocked && (
        <Alert
          type="warning"
          showIcon
          title={PPC.PANELS.EDIT.APPROVED_LOCKED_ALERT}
          style={{ marginTop: 16 }}
        />
      )}

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
