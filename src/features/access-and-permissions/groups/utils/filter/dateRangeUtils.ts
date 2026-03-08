import dayjs from 'dayjs';
import type { DateRangeFilter } from '../../../../../interfaces/date/filter';

export const filterByDateRange = <T>(
  items: T[],
  dateRange: DateRangeFilter | undefined,
  getDate: (item: T) => string | dayjs.Dayjs,
): T[] => {
  if (!dateRange?.from && !dateRange?.to) return items;

  const from = dateRange.from ? dayjs(dateRange.from).startOf('day') : null;
  const to = dateRange.to ? dayjs(dateRange.to).endOf('day') : null;

  return items.filter((item) => {
    const value = getDate(item);
    const date = dayjs(value);
    if (!date.isValid()) return false;
    if (from && date.isBefore(from)) return false;
    if (to && date.isAfter(to)) return false;
    return true;
  });
};
