import { toTimestamp } from '../../../utils/shared/time';
import type { Application } from '../../applications/models';
import type { ProtectionPlan } from '../../plans/protection/models';
import type { ApplicationsSummary, BoxState, PlansSummary } from '../models';

const healthStatus = (app: Application): string => (app.health?.status ?? '').toLowerCase();

export const summarizeApplications = (apps: Application[]): ApplicationsSummary => ({
  total: apps.length,
  healthy: apps.filter((a) => healthStatus(a) === 'healthy').length,
  degraded: apps.filter((a) => healthStatus(a) === 'degraded').length,
  down: apps.filter((a) => healthStatus(a) === 'down').length,
  unknown: apps.filter((a) => !['healthy', 'degraded', 'down'].includes(healthStatus(a))).length,
  drifted: apps.filter((a) => a.history?.hasDrift).length,
});

export const recentlyChangedApplications = (apps: Application[]): Application[] =>
  apps
    .filter((a) => toTimestamp(a.metrics?.derived?.lastChangeDetectedAt) > 0)
    .sort(
      (a, b) =>
        toTimestamp(b.metrics.derived.lastChangeDetectedAt) -
        toTimestamp(a.metrics.derived.lastChangeDetectedAt),
    );

// Health only means something while a plan's policies are supposed to be in place.
const isActive = (plan: ProtectionPlan): boolean => plan.phase === 'active';

const planAttentionRank = (plan: ProtectionPlan): number => {
  if (plan.phase === 'failed') return 0;
  if (isActive(plan) && plan.health === 'degraded') return 1;
  if (isActive(plan) && plan.health === 'drifted') return 2;
  return -1;
};

export const summarizePlans = (plans: ProtectionPlan[]): PlansSummary => ({
  total: plans.length,
  active: plans.filter(isActive).length,
  scheduled: plans.filter((p) => p.phase === 'scheduled').length,
  drifted: plans.filter((p) => isActive(p) && p.health === 'drifted').length,
  degraded: plans.filter((p) => isActive(p) && p.health === 'degraded').length,
  failed: plans.filter((p) => p.phase === 'failed').length,
});

export const plansNeedingAttention = (plans: ProtectionPlan[]): ProtectionPlan[] =>
  plans
    .filter((p) => planAttentionRank(p) >= 0)
    .sort(
      (a, b) =>
        planAttentionRank(a) - planAttentionRank(b) ||
        toTimestamp(b.lastUpdatedAt) - toTimestamp(a.lastUpdatedAt),
    );

// Keep showing the last good data through a failed or in-flight poll.
export const toBoxState = (loading: boolean, error: string | null, hasData: boolean): BoxState => ({
  loading: loading && !hasData,
  failed: Boolean(error) && !hasData,
});
