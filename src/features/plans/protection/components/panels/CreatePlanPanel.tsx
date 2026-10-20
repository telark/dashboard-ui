import React, { useCallback, useMemo, useState } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { ExpandPanelButton } from '../../../../../components/display/panels/slide-out';
import Section from '../../../../../components/display/sections/Section';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { CREATE_PANEL_TEXTS as T } from '../../constants/createPanel';
import PlanForm from '../shared/PlanForm';
import type { FormValues, PolicyEntry } from '../create';
import { usePlanFormData } from '../../hooks/usePlanFormData';
import { usePlanNameCheck } from '../../hooks/usePlanNameCheck';
import { usePlanActions } from '../../hooks/usePlanActions';
import { usePlanFormState } from '../../hooks/usePlanFormState';
import {
  DEFAULT_FORM_VALUES,
  buildPreparePayload,
  hasInvalidParams,
  repeatFormValues,
} from '../../utils/planFormValues';
import { createOutcome, planSummary } from '../../utils/createPlanSummary';

const PANEL_WIDTH = 720;
const PANEL_WIDTH_EXPANDED = 1400;

const SUMMARY_STYLE: React.CSSProperties = {
  margin: 0,
  padding: 12,
  border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
  borderRadius: 8,
  background: DEFAULT_COLORS.SURFACE_SUBTLE,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE,
  fontSize: 13,
  lineHeight: 1.6,
};

interface CreatePlanPanelProps {
  open: boolean;
  onClose: () => void;
  form: FormInstance<FormValues>;
}

const INITIAL_POLICIES: PolicyEntry[] = [];

const CreatePlanPanel: React.FC<CreatePlanPanelProps> = ({ open, onClose, form }) => {
  const [expanded, setExpanded] = useState(false);
  const [policies, setPolicies] = useState<PolicyEntry[]>(() => INITIAL_POLICIES);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const data = usePlanFormData(open);
  const { nameValidator, nameInvalid } = usePlanNameCheck(form, open);

  const handleClose = useCallback(() => {
    setAttemptedSubmit(false);
    setPolicies(INITIAL_POLICIES);
    onClose();
  }, [onClose]);
  const { submitting, handleCreate } = usePlanActions();

  const initialValues = useMemo<FormValues>(
    () => ({ ...DEFAULT_FORM_VALUES, ...repeatFormValues() }),
    [],
  );

  const { hasFormErrors } = usePlanFormState({
    form,
    isEditMode: false,
    initialValues,
    initialPolicies: INITIAL_POLICIES,
    policies,
    enabled: open,
  });

  const handlePolicyParamChange = useCallback((index: number, key: string, values: string[]) => {
    setPolicies((prev) =>
      prev.map((p, i) => (i === index ? { ...p, params: { ...p.params, [key]: values } } : p)),
    );
  }, []);

  const handleFinish = useCallback(
    async (values: FormValues) => {
      const payload = buildPreparePayload({ values, policies });
      try {
        await handleCreate(payload);
        handleClose();
      } catch {
        // surfaced via message in hook
      }
    },
    [handleCreate, handleClose, policies],
  );

  const submitDisabled =
    nameInvalid ||
    policies.length === 0 ||
    hasInvalidParams(policies, data.templates) ||
    (attemptedSubmit && hasFormErrors);

  const watched = Form.useWatch([], form) as Partial<FormValues> | undefined;
  const values: FormValues = { ...initialValues, ...watched };
  const outcome = createOutcome(buildPreparePayload({ values, policies }));
  const summary = planSummary({
    values,
    policies,
    templates: data.templates,
    applicationOptions: data.applicationOptions,
  });
  // Kept while the confirm closes, so its text doesn't change under the closing animation.
  const [confirm, setConfirm] = useState<{ open: boolean; values?: FormValues; summary: string }>({
    open: false,
    summary: '',
  });

  const handleSubmitClick = () => {
    setAttemptedSubmit(true);
    // Checked again now: a start that passed since the last render enforces at once too.
    if (createOutcome(buildPreparePayload({ values, policies })) !== 'enforce') {
      form.submit();
      return;
    }
    // The one instant case that refuses changes asks first, once the form is valid.
    form.validateFields().then(
      (valid) => setConfirm({ open: true, values: valid, summary }),
      () => undefined,
    );
  };

  const panelWidth = expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH;

  return (
    <>
      <AnimationWrapper
        open={open}
        onClose={handleClose}
        title={PPC.PANELS.CREATE.TITLE}
        width={panelWidth}
        headerExtra={
          <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((p) => !p)} />
        }
        footer={{
          onCancel: handleClose,
          onPrimary: handleSubmitClick,
          primaryLabel: T.SUBMIT[outcome],
          primaryLoading: submitting,
          primaryDisabled: submitDisabled,
        }}
      >
        <PlanForm
          form={form}
          initialValues={initialValues}
          policies={policies}
          onPoliciesChange={setPolicies}
          onPolicyParamChange={handlePolicyParamChange}
          onSubmit={handleFinish}
          mode="create"
          nameValidator={nameValidator}
          validateTrigger={attemptedSubmit ? 'onChange' : 'onSubmit'}
          {...data}
        />
        <Section
          title={T.SUMMARY.TITLE}
          style={{ marginTop: PPC.CREATE_PAGE.GAP_BETWEEN_CARDS }}
          content={<p style={SUMMARY_STYLE}>{summary}</p>}
        />
      </AnimationWrapper>
      <ActionConfirmModal
        open={confirm.open}
        onClose={() => setConfirm((prev) => ({ ...prev, open: false }))}
        onConfirm={() => (confirm.values ? handleFinish(confirm.values) : undefined)}
        title={T.CONFIRM.TITLE(confirm.values?.name ?? '')}
        action={T.CONFIRM.OK}
        resourceName=""
        customMessage={confirm.summary}
        note={T.CONFIRM.NOTE}
        loading={submitting}
        getContainer={() => document.body}
        offsetRight={panelWidth}
      />
    </>
  );
};

export default CreatePlanPanel;
