import React, { useCallback, useMemo, useState } from 'react';
import type { FormInstance } from 'antd';
import { Icons } from '../../../../../constants';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { ExpandPanelButton } from '../../../../../components/display/panels/slide-out';
import { PanelFooter } from '../../../../../components/display/panels/shared';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import PlanForm from '../shared/PlanForm';
import type { FormValues, PolicyEntry } from '../create';
import { usePlanFormData } from '../../hooks/usePlanFormData';
import { usePlanActions } from '../../hooks/usePlanActions';
import { usePlanFormState } from '../../hooks/usePlanFormState';
import { DEFAULT_FORM_VALUES, buildPreparePayload } from '../../utils/planFormValues';

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
  const data = usePlanFormData(open);
  const { submitting, handleCreate } = usePlanActions();

  const initialValues = useMemo<FormValues>(() => DEFAULT_FORM_VALUES, []);

  const { hasFormErrors } = usePlanFormState({
    form,
    isEditMode: false,
    initialValues,
    initialPolicies: INITIAL_POLICIES,
    policies,
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
        onClose();
      } catch {
        // surfaced via message in hook
      }
    },
    [handleCreate, onClose, policies],
  );

  const submitDisabled = hasFormErrors;

  return (
    <AnimationWrapper
      open={open}
      onClose={onClose}
      title={PPC.PANELS.CREATE.TITLE}
      subtitle={PPC.PANELS.CREATE.SUBTITLE}
      width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
      headerExtra={
        <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((p) => !p)} />
      }
    >
      <div style={{ overflow: 'auto', flex: 1 }}>
        <PlanForm
          form={form}
          initialValues={initialValues}
          policies={policies}
          onPoliciesChange={setPolicies}
          onPolicyParamChange={handlePolicyParamChange}
          onSubmit={handleFinish}
          submitting={submitting}
          mode="create"
          hideSubmitButton
          submitLabel={PPC.PANELS.CREATE.SUBMIT_BUTTON}
          loadingLabel={PPC.PANELS.CREATE.LOADING_LABEL}
          {...data}
        />
      </div>
      <PanelFooter
        onCancel={onClose}
        onPrimary={() => form.submit()}
        cancelLabel="Cancel"
        primaryLabel={PPC.PANELS.CREATE.SUBMIT_BUTTON}
        primaryLoading={submitting}
        primaryLoadingLabel={PPC.PANELS.CREATE.LOADING_LABEL}
        primaryIcon={<ProtectionPlansIcon size={16} />}
        primaryDisabled={submitDisabled || submitting}
        horizontalPadding={0}
      />
    </AnimationWrapper>
  );
};

export default CreatePlanPanel;
