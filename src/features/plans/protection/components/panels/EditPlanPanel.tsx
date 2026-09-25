import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormInstance } from 'antd';
import { Icons, SLIDE_OUT } from '../../../../../constants';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { ExpandPanelButton } from '../../../../../components/display/panels/slide-out';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import PlanForm from '../shared/PlanForm';
import type { FormValues, PolicyEntry } from '../create';
import type { ProtectionPlan } from '../../models';
import { usePlanFormData } from '../../hooks/usePlanFormData';
import { usePlanActions } from '../../hooks/usePlanActions';
import { usePlanFormState } from '../../hooks/usePlanFormState';
import { buildPreparePayload, planToFormValues, planToPolicies } from '../../utils/planFormValues';

const PANEL_WIDTH = 720;
const PANEL_WIDTH_EXPANDED = 1400;

const ProtectionPlansIcon = Icons.ProtectionPlans;

interface EditPlanPanelProps {
  open: boolean;
  onClose: () => void;
  plan: ProtectionPlan;
  form: FormInstance<FormValues>;
}

const EditPlanPanel: React.FC<EditPlanPanelProps> = ({ open, onClose, plan, form }) => {
  const [expanded, setExpanded] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const data = usePlanFormData(open);

  const handleClose = useCallback(() => {
    setAttemptedSubmit(false);
    onClose();
  }, [onClose]);

  const { submitting, handleUpdate } = usePlanActions();

  const initialValues = useMemo<FormValues>(() => planToFormValues(plan), [plan]);
  const initialPolicies = useMemo<PolicyEntry[]>(() => planToPolicies(plan), [plan]);
  const [policies, setPolicies] = useState<PolicyEntry[]>(() => initialPolicies);

  // Captured once, when the panel opens. The details page polls the plan, so
  // seeding from the live `initialValues` would reset the form under the user.
  const [openValues] = useState<FormValues>(() => initialValues);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(openValues);
  }, [open, form, openValues]);

  const { hasFormErrors, hasChanges } = usePlanFormState({
    form,
    isEditMode: true,
    initialValues,
    initialPolicies,
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
        await handleUpdate(plan.id, payload);
        handleClose();
      } catch {
        // surfaced via message in hook
      }
    },
    [handleUpdate, handleClose, plan, policies],
  );

  const submitDisabled = !hasChanges || policies.length === 0 || (attemptedSubmit && hasFormErrors);

  const handleSubmitClick = () => {
    setAttemptedSubmit(true);
    form.submit();
  };

  return (
    <AnimationWrapper
      open={open}
      onClose={handleClose}
      title={SLIDE_OUT.ENTITY_TITLE(PPC.PANELS.EDIT.TITLE, plan.name)}
      width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
      headerExtra={
        <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((p) => !p)} />
      }
      footer={{
        onCancel: handleClose,
        onPrimary: handleSubmitClick,
        primaryLabel: PPC.PANELS.EDIT.SUBMIT_BUTTON,
        primaryLoading: submitting,
        primaryLoadingLabel: PPC.PANELS.EDIT.LOADING_LABEL,
        primaryIcon: <ProtectionPlansIcon size={16} />,
        primaryDisabled: submitDisabled || submitting,
      }}
    >
      <PlanForm
        form={form}
        initialValues={initialValues}
        policies={policies}
        onPoliciesChange={setPolicies}
        onPolicyParamChange={handlePolicyParamChange}
        onSubmit={handleFinish}
        submitting={submitting}
        mode="edit"
        plan={plan}
        hideSubmitButton
        submitLabel={PPC.PANELS.EDIT.SUBMIT_BUTTON}
        loadingLabel={PPC.PANELS.EDIT.LOADING_LABEL}
        validateTrigger={attemptedSubmit ? 'onChange' : 'onSubmit'}
        {...data}
      />
    </AnimationWrapper>
  );
};

export default EditPlanPanel;
