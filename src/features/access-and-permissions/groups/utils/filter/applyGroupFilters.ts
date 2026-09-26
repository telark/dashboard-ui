import type { Group } from '../../models/groups';
import type { DateRangeFilter } from '../../../../../interfaces/date/filter';
import { filterByDateRange } from './dateRangeUtils';
import { applySearch } from '../../../../../utils/search/applySearch';

export const applyGroupFilters = (
  baseGroups: Group[] | undefined,
  appliedFilters: Record<string, unknown>,
  searchTerm?: string,
): Group[] => {
  let result = baseGroups || [];

  if (searchTerm) {
    result = applySearch(result, searchTerm, [(group) => group.name]);
  }

  const dateRange = appliedFilters.dateRange as DateRangeFilter | undefined;
  result = filterByDateRange(result, dateRange, (group) => group.creationDate);

  const category = appliedFilters.category as string | undefined;
  if (category && category !== 'all') {
    result = result.filter((group) => group.categoryID === category);
  }

  return result;
};
