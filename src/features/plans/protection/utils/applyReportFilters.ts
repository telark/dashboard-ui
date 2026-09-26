import { filterByDateRange } from '../../../access-and-permissions/groups/utils/filter/dateRangeUtils';
import type { DateRangeFilter } from '../../../../interfaces/date/filter';
import type { PlanReportMeta, ProtectionPlan } from '../models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const selected = (filters: Record<string, unknown>, key: string): string[] =>
  (filters[key] as string[] | undefined) ?? [];

const excludes = (values: string[], value: string): boolean =>
  values.length > 0 && !values.includes(value);

export function applyReportFilters(
  reports: PlanReportMeta[],
  filters: Record<string, unknown>,
  search: string,
  planById: Map<string, ProtectionPlan>,
): PlanReportMeta[] {
  const planIds = selected(filters, PPC.FILTER_KEYS.PLAN);
  const environments = selected(filters, PPC.FILTER_KEYS.ENVIRONMENT);
  const triggers = selected(filters, PPC.FILTER_KEYS.TRIGGER);
  const dateRange = filters[PPC.FILTER_KEYS.DATE_RANGE] as DateRangeFilter | undefined;
  const query = search.trim().toLowerCase();

  return filterByDateRange(reports, dateRange, (r) => r.generatedAt).filter((report) => {
    const plan = planById.get(report.planId);
    if (excludes(planIds, report.planId)) return false;
    if (excludes(environments, plan?.environmentRef ?? '')) return false;
    if (excludes(triggers, report.trigger)) return false;
    return !query || (plan?.name ?? '').toLowerCase().includes(query);
  });
}
