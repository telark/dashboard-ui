import type { User } from '../../models';
import type { DateRangeFilter } from '../../../../../interfaces/date/filter';
import { filterByDateRange } from '../../../groups/utils/filter/dateRangeUtils';
import { applySearch } from '../../../../../utils/search';

export const applyUserFilters = (
  baseUsers: User[],
  appliedFilters: Record<string, unknown>,
  searchTerm?: string,
): User[] => {
  let result = baseUsers;

  if (searchTerm?.trim()) {
    result = applySearch(result, searchTerm, [
      (u) => u.username,
      (u) => u.fullname,
      (u) => u.email,
    ]);
  }

  const dateRange = appliedFilters.dateRange as DateRangeFilter | undefined;
  result = filterByDateRange(result, dateRange, (user) => user.creationDate);

  const status = appliedFilters.status as string | undefined;
  if (status && status !== 'all') {
    result = result.filter((user) => {
      const phase = user.status?.phase?.toLowerCase() ?? '';
      if (status === 'active') return phase === 'active';
      if (status === 'inactive') return phase !== 'active';
      return true;
    });
  }

  return result;
};
