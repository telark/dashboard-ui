import type { Group } from '../../models/groups';
import type { DateRangeFilter } from '../../../../../interfaces/date/filter';
import { filterByDateRange } from './dateRangeUtils';

export const applyGroupFilters = (
  baseGroups: Group[] | undefined,
  appliedFilters: Record<string, unknown>,
): Group[] => {
  let result = baseGroups || [];

  const dateRange = appliedFilters.dateRange as DateRangeFilter | undefined;
  result = filterByDateRange(result, dateRange, (group) => group.creationDate);

  const category = appliedFilters.category as string | undefined;
  if (category && category !== 'all') {
    result = result.filter((group) => group.categoryID === category);
  }

  return result;
};
