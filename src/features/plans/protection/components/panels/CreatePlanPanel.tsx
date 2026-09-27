import React, { useCallback, useMemo, useState } from 'react';
import type { FormInstance } from 'antd';
import { Icons } from '../../../../../constants';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { ExpandPanelButton } from '../../../../../components/display/panels/slide-out';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
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
} from '../../utils/planFormValues';

const PANEL_WIDTH = 720;
const PANEL_WIDTH_EXPANDED = 1400;

const ProtectionPlansIcon = Icons.ProtectionPlans;

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

  const initialValues = useMemo<FormValues>(() => DEFAULT_FORM_VALUES, []);

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

  const handleSubmitClick = () => {
    setAttemptedSubmit(true);
    form.submit();
  };

  return (
    <AnimationWrapper
      open={open}
      onClose={handleClose}
      title={PPC.PANELS.CREATE.TITLE}
      width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
      headerExtra={
        <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((p) => !p)} />
      }
      footer={{
        onCancel: handleClose,
        onPrimary: handleSubmitClick,
        primaryLabel: PPC.PANELS.CREATE.SUBMIT_BUTTON,
        primaryLoading: submitting,
        primaryLoadingLabel: PPC.PANELS.CREATE.LOADING_LABEL,
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
        mode="create"
        nameValidator={nameValidator}
        hideSubmitButton
        submitLabel={PPC.PANELS.CREATE.SUBMIT_BUTTON}
        loadingLabel={PPC.PANELS.CREATE.LOADING_LABEL}
        validateTrigger={attemptedSubmit ? 'onChange' : 'onSubmit'}
        {...data}
      />
    </AnimationWrapper>
  );
};

export default CreatePlanPanel;
