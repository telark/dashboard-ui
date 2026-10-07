import { APP_ROUTES, DEFAULT_COLORS, STATUS_COLORS } from '../../../constants';
import type { Application } from '../../applications/models';
import { getApplicationHealthAccentColor } from '../../applications/utils/healthVisual';
import type { ProtectionPlan } from '../../plans/protection/models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../plans/protection/constants/protectionPlans';
import { HOME_DASHBOARD_TEXTS as T } from '../constants/dashboard';
import type { ApplicationsSummary, BreakdownItem, DashboardRowItem, PlansSummary } from '../models';

const applicationPath = (app: Application): string =>
  APP_ROUTES.APPLICATION_DETAILS.replace(':name', app.name);

const planPath = (plan: ProtectionPlan): string =>
  APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', encodeURIComponent(plan.name));

const countLabel = (count: number, singular: string, plural: string): string =>
  `${count} ${count === 1 ? singular : plural}`;

const joinMeta = (...parts: (string | undefined)[]): string =>
  parts.filter(Boolean).join(T.META_SEPARATOR);

export const applicationsBreakdown = (summary: ApplicationsSummary): BreakdownItem[] => [
  {
    label: T.APPLICATIONS.HEALTHY,
    count: summary.healthy,
    color: getApplicationHealthAccentColor('healthy'),
  },
  {
    label: T.APPLICATIONS.DEGRADED,
    count: summary.degraded,
    color: getApplicationHealthAccentColor('degraded'),
  },
  {
    label: T.APPLICATIONS.DOWN,
    count: summary.down,
    color: getApplicationHealthAccentColor('down'),
  },
  {
    label: T.APPLICATIONS.UNKNOWN,
    count: summary.unknown,
    color: getApplicationHealthAccentColor('unknown'),
  },
  { label: T.APPLICATIONS.DRIFTED, count: summary.drifted, color: DEFAULT_COLORS.WARNING },
];

export const plansBreakdown = (summary: PlansSummary): BreakdownItem[] => [
  { label: T.PLANS.ACTIVE, count: summary.active, color: STATUS_COLORS.PLAN_PHASE.active },
  { label: T.PLANS.SCHEDULED, count: summary.scheduled, color: STATUS_COLORS.PLAN_PHASE.scheduled },
  { label: T.PLANS.DRIFTED, count: summary.drifted, color: STATUS_COLORS.PLAN_HEALTH.drifted },
  { label: T.PLANS.DEGRADED, count: summary.degraded, color: STATUS_COLORS.PLAN_HEALTH.degraded },
  { label: T.PLANS.FAILED, count: summary.failed, color: STATUS_COLORS.PLAN_PHASE.failed },
];

export const recentChangeRow = (app: Application): DashboardRowItem => {
  const { totalChanges, totalIncidents, lastChangeDetectedAt } = app.metrics.derived;
  return {
    key: app.name,
    dotColor: getApplicationHealthAccentColor(app.health?.status),
    title: app.displayName || app.name,
    meta: joinMeta(
      countLabel(totalChanges, T.RECENT_CHANGES.CHANGE, T.RECENT_CHANGES.CHANGES),
      countLabel(totalIncidents, T.RECENT_CHANGES.INCIDENT, T.RECENT_CHANGES.INCIDENTS),
    ),
    time: lastChangeDetectedAt,
    to: applicationPath(app),
  };
};

export const planAttentionRow = (plan: ProtectionPlan): DashboardRowItem => ({
  key: plan.id,
  dotColor:
    plan.phase === 'failed'
      ? STATUS_COLORS.PLAN_PHASE.failed
      : STATUS_COLORS.PLAN_HEALTH[plan.health ?? 'unknown'],
  title: plan.name,
  meta: joinMeta(
    PPC.LABELS.PHASE_LABELS[plan.phase] ?? plan.phase,
    plan.health && PPC.LABELS.HEALTH_LABELS[plan.health],
  ),
  time: plan.healthCheckedAt ?? plan.lastUpdatedAt,
  to: planPath(plan),
});
