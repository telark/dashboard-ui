import dayjs from 'dayjs';
import type { Group } from '../../models/groups';
import type { DateRangeFilter } from '../../../../../interfaces/date/filter';

export const applyGroupFilters = (
  baseGroups: Group[] | undefined,
  appliedFilters: Record<string, unknown>,
): Group[] => {
  let result = baseGroups || [];

  const dateRange = appliedFilters.dateRange as DateRangeFilter | undefined;
  if (dateRange?.from || dateRange?.to) {
    const from = dateRange.from ? dayjs(dateRange.from).startOf('day') : null;
    const to = dateRange.to ? dayjs(dateRange.to).endOf('day') : null;

    result = result.filter((group) => {
      const creation = dayjs(group.creationDate);
      if (from && creation.isBefore(from)) return false;
      if (to && creation.isAfter(to)) return false;
      return true;
    });
  }

  return result;
};
