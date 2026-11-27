import { filterByDateRange } from '../../../access-and-permissions/groups/utils/filter/dateRangeUtils';
import type { DateRangeFilter } from '../../../../interfaces/date/filter';
import type { ProtectionPlan } from '../models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const has = (arr: string[]) => arr.length > 0;

// An unset filter keeps every plan; a set one needs one of the plan's values among the picked ones.
const matchesAny = (picked: string[], values: string[]) =>
  !has(picked) || values.some((v) => picked.includes(v));

const targetsOf = (p: ProtectionPlan): string[] =>
  p.scope.type === 'namespaces' ? (p.scope.namespaces ?? []) : (p.scope.applicationRefs ?? []);

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
  const kind = (filters[PPC.FILTER_KEYS.KIND] as string[]) || [];
  const environment = (filters[PPC.FILTER_KEYS.ENVIRONMENT] as string[]) || [];
  const tags = (filters[PPC.FILTER_KEYS.TAGS] as string[]) || [];

  if (
    !has(scopeType) &&
    !has(createdBy) &&
    !has(templates) &&
    !has(targets) &&
    !has(kind) &&
    !has(environment) &&
    !has(tags) &&
    !dateRange?.from &&
    !dateRange?.to
  ) {
    return plans;
  }

  const filteredByDate = filterByDateRange(plans, dateRange, (p) => p.createdAt);
  return filteredByDate.filter(
    (p) =>
      matchesAny(scopeType, [p.scope.type]) &&
      matchesAny(createdBy, [p.createdBy]) &&
      matchesAny(
        templates,
        (p.policies ?? []).map((policy) => policy.templateID),
      ) &&
      matchesAny(targets, targetsOf(p)) &&
      matchesAny(kind, [p.kindRef ?? '']) &&
      matchesAny(environment, [p.environmentRef ?? '']) &&
      matchesAny(tags, p.tagRefs ?? []),
  );
}
