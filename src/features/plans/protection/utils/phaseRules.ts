import type { PlanPhase, ProtectionPlan } from '../models';
import { toTimestamp } from '../../../../utils/shared/time';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

export const APPROVABLE_PHASES: PlanPhase[] = ['pending_approval'];
export const CANCELLABLE_PHASES: PlanPhase[] = [
  'active',
  'scheduled',
  'failed',
  'pending_approval',
];
export const REACTIVATABLE_PHASES: PlanPhase[] = ['canceled', 'terminated', 'failed'];

export const isReactivateExpired = (plan: ProtectionPlan): boolean => {
  if (plan.timeMode !== 'time_range' || !plan.timeRange?.endAt) return false;
  return toTimestamp(plan.timeRange.endAt) <= Date.now();
};

export const getDecideBlockedTooltip = (
  plan: ProtectionPlan,
  userId: string,
): string | undefined => {
  if (plan.approval?.requestedBy === userId) {
    return PPC.LABELS.DETAIL_PAGE.ACTIONS.SELF_DECISION_TOOLTIP;
  }
  if (isReactivateExpired(plan)) {
    return PPC.LABELS.DETAIL_PAGE.ACTIONS.DECIDE_DISABLED_EXPIRED_TOOLTIP;
  }
  return undefined;
};

export const permissionTooltip = (
  allowed: boolean,
  denied: string,
  otherwise?: string,
): string | undefined => (allowed ? otherwise : denied);

export const isRejected = (plan: ProtectionPlan): boolean =>
  plan.phase === 'canceled' && plan.approval?.state === 'rejected';

export const planPhaseLabel = (plan: ProtectionPlan): string =>
  isRejected(plan)
    ? PPC.LABELS.PHASE_INFO.REJECTED_LABEL
    : (PPC.LABELS.PHASE_LABELS[plan.phase] ?? plan.phase);

export const isMaterialEditLocked = (plan: ProtectionPlan): boolean =>
  plan.approvalMode === 'required' && (plan.phase === 'active' || plan.phase === 'scheduled');

export const isReportNotStarted = (plan: ProtectionPlan): boolean =>
  plan.phase === 'draft' || plan.phase === 'scheduled' || !plan.startedAt;

export const getGenerateReportTooltip = (
  plan: ProtectionPlan,
  canGenerate: boolean,
): string | undefined =>
  permissionTooltip(
    canGenerate,
    PPC.LABELS.PERMISSION_DENIED.GENERATE_REPORT,
    isReportNotStarted(plan) ? PPC.LABELS.REPORTS.NOT_STARTED_HINT : undefined,
  );
