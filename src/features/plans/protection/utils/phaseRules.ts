import type { PlanPhase, ProtectionPlan } from '../models';

export const CANCELLABLE_PHASES: PlanPhase[] = ['active', 'scheduled', 'failed'];
export const NON_EDITABLE_PHASES: PlanPhase[] = ['terminated', 'canceled'];
export const REACTIVATABLE_PHASES: PlanPhase[] = ['canceled', 'terminated', 'failed'];

export const isReactivateExpired = (plan: ProtectionPlan): boolean => {
  if (plan.timeMode !== 'time_range' || !plan.timeRange?.endAt) return false;
  return new Date(plan.timeRange.endAt).getTime() <= Date.now();
};
