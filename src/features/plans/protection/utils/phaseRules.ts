import type { PlanPhase, ProtectionPlan } from '../models';
import { toTimestamp } from '../../../../utils/shared/time';

export const CANCELLABLE_PHASES: PlanPhase[] = ['active', 'scheduled', 'failed'];
export const NON_EDITABLE_PHASES: PlanPhase[] = ['terminated', 'canceled'];
export const REACTIVATABLE_PHASES: PlanPhase[] = ['canceled', 'terminated', 'failed'];

export const isReactivateExpired = (plan: ProtectionPlan): boolean => {
  if (plan.timeMode !== 'time_range' || !plan.timeRange?.endAt) return false;
  return toTimestamp(plan.timeRange.endAt) <= Date.now();
};
