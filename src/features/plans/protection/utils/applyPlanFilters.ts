import { filterByDateRange } from '../../../access-and-permissions/groups/utils/filter/dateRangeUtils';
import type { DateRangeFilter } from '../../../../interfaces/date/filter';
import type { ProtectionPlan } from '../models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const has = (arr: string[]) => arr.length > 0;

export function applyPlanFilters(
  plans: ProtectionPlan[],
  filters: Record<string, unknown>,
): ProtectionPlan[] {
  const dateRange =
    (filters[PPC.FILTER_KEYS.DATE_RANGE] as DateRangeFilter | undefined) || undefined;
  const scopeType = (filters[PPC.FILTER_KEYS.SCOPE_TYPE] as string[]) || [];
  const createdBy = (filters[PPC.FILTER_KEYS.CREATED_BY] as string[]) || [];
  const templates = (filters[PPC.FILTER_KEYS.TEMPLATES] as string[]) || [];
  const targets = (filters[PPC.FILTER_KEYS.TARGETS] as string[]) || [];
  const environment = (filters[PPC.FILTER_KEYS.ENVIRONMENT] as string[]) || [];
  const tags = (filters[PPC.FILTER_KEYS.TAGS] as string[]) || [];

  if (
    !has(scopeType) &&
    !has(createdBy) &&
    !has(templates) &&
    !has(targets) &&
    !has(environment) &&
    !has(tags) &&
    !dateRange?.from &&
    !dateRange?.to
  ) {
    return plans;
  }

  const filteredByDate = filterByDateRange(plans, dateRange, (p) => p.createdAt);
  return filteredByDate.filter((p) => {
    if (has(scopeType) && !scopeType.includes(p.scope.type)) return false;
    if (has(createdBy) && !createdBy.includes(p.createdBy)) return false;
    if (has(templates)) {
      const planTemplateIds = (p.policies ?? []).map((policy) => policy.templateID);
      if (!planTemplateIds.some((id) => templates.includes(id))) return false;
    }
    if (has(targets)) {
      const planTargets =
        p.scope.type === 'namespaces' ? (p.scope.namespaces ?? []) : (p.scope.applicationIds ?? []);
      if (!planTargets.some((t) => targets.includes(t))) return false;
    }
    if (has(environment) && !environment.includes(p.environmentID ?? '')) return false;
    if (has(tags) && !(p.tagIDs ?? []).some((t) => tags.includes(t))) return false;
    return true;
  });
}
