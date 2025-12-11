import type { Dayjs } from 'dayjs';

export interface DateRangeFilter {
  from?: Dayjs | null;
  to?: Dayjs | null;
}
