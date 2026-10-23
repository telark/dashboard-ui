import { POLICY_CHIP_LABEL, POLICY_NAME_PREFIX } from '../../constants/protectionPlans';
import type {
  PlanMode,
  PlanPolicyStatus,
  PlanStatusResponse,
  PlanTemplate,
  ProtectionPlan,
} from '../../models';

// The live check once it answers, else the plan's last stored check.
export const healthRows = (
  plan: ProtectionPlan,
  status: PlanStatusResponse | null,
): PlanPolicyStatus[] =>
  status
    ? (status.policies ?? [])
    : (plan.healthDetail ?? []).map((d) => ({
        name: d.policyName,
        namespace: d.namespace,
        present: d.present,
        ready: d.ready,
        failureAction: d.failureAction,
      }));

// The engine reports `Audit`/`Enforce`, the plan `audit`/`enforce`.
export const actsAs = (row: PlanPolicyStatus, mode: PlanMode): boolean =>
  row.failureAction.toLowerCase() === mode;

export const auditsOnly = (row: PlanPolicyStatus, mode: PlanMode): boolean =>
  mode === 'enforce' && row.present && actsAs(row, 'audit');

// In force: deployed, active in the engine, and refusing when the plan enforces.
export const isInForce = (row: PlanPolicyStatus, mode: PlanMode): boolean =>
  row.present && row.ready && !auditsOnly(row, mode);

// The operation label of a rendered policy (telark `PolicyName`), when one of the templates rendered it.
export const policyLabel = (
  name: string,
  planId: string,
  templates: PlanTemplate[],
): string | undefined => {
  const template = templates.find((t) => name.startsWith(POLICY_NAME_PREFIX(planId, t.code)));
  return template && POLICY_CHIP_LABEL[template.id];
};
