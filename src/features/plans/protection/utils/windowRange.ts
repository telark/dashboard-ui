import { TIME_FORMATS } from '../../../../constants';
import { formatDateTime, getTimeZone } from '../../../../utils/shared/time';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import type { PlanTimeRange } from '../models';

const { CARD, PHASE_INFO } = PPC.LABELS;

// "Oct 22, 08:00 → 20:00": the end drops its date when it falls on the start's day.
export const formatWindowRange = ({ startAt, endAt }: PlanTimeRange): string => {
  const sameDay =
    formatDateTime(startAt, TIME_FORMATS.DATE_KEY) === formatDateTime(endAt, TIME_FORMATS.DATE_KEY);
  const end = formatDateTime(
    endAt,
    sameDay ? TIME_FORMATS.HOUR_MINUTE : TIME_FORMATS.SHORT_DATE_TIME,
  );
  return `${formatDateTime(startAt, TIME_FORMATS.SHORT_DATE_TIME)}${CARD.RANGE_SEPARATOR}${end}`;
};

// The same range, named in the viewer's time zone the times are shown in.
export const formatZonedWindowRange = (range: PlanTimeRange): string =>
  PHASE_INFO.IN_TIME_ZONE(formatWindowRange(range), getTimeZone());
