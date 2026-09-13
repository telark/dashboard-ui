import { format, formatDistanceToNow, parse } from 'date-fns';
import { TIME_FORMATS, TIME_TEXTS, TIME_ZONE } from '../../constants/shared/time';
import { getCurrentUser } from '../../features/auth/utils/session/user';

export type DateInput = string | number | Date;

export const parseDate = (value: DateInput | null | undefined): Date | null => {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const toTimestamp = (value: DateInput | null | undefined): number =>
  parseDate(value)?.getTime() ?? 0;

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

const getPartsFormatter = (timeZone: string): Intl.DateTimeFormat => {
  let formatter = partsFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(TIME_ZONE.PARTS_LOCALE, {
      timeZone,
      hourCycle: TIME_ZONE.HOUR_CYCLE,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    partsFormatters.set(timeZone, formatter);
  }
  return formatter;
};

export const isValidTimeZone = (timeZone: string): boolean => {
  try {
    getPartsFormatter(timeZone);
    return true;
  } catch {
    return false;
  }
};

export const getBrowserTimeZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || TIME_ZONE.FALLBACK;

export const getBrowserRegion = (): string | undefined => {
  try {
    return new Intl.Locale(navigator.language).maximize().region;
  } catch {
    return undefined;
  }
};

export const getSupportedTimeZones = (): string[] => [
  ...new Set([TIME_ZONE.FALLBACK, getBrowserTimeZone(), ...Intl.supportedValuesOf('timeZone')]),
];

export const formatTimeZoneOffset = (timeZone: string, date: Date = new Date()): string =>
  new Intl.DateTimeFormat(TIME_ZONE.PARTS_LOCALE, { timeZone, timeZoneName: TIME_ZONE.OFFSET_NAME })
    .formatToParts(date)
    .find(({ type }) => type === 'timeZoneName')?.value ?? '';

export const getTimeZone = (): string => {
  const preferred = getCurrentUser()?.settings?.timezone;
  return preferred && isValidTimeZone(preferred) ? preferred : getBrowserTimeZone();
};

// Returns a local Date whose fields read as the wall clock in `timeZone`,
// because date-fns and antd pickers only understand the browser's local time.
export const toZonedTime = (date: Date, timeZone: string = getTimeZone()): Date => {
  const parts: Record<string, number> = {};
  getPartsFormatter(timeZone)
    .formatToParts(date)
    .forEach(({ type, value }) => {
      parts[type] = Number(value);
    });
  return new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    date.getMilliseconds(),
  );
};

export const fromZonedTime = (wallClock: Date, timeZone: string = getTimeZone()): Date => {
  let instant = wallClock.getTime();
  // A second pass settles the offset when the first guess lands across a DST change.
  for (let pass = 0; pass < 2; pass += 1) {
    instant += wallClock.getTime() - toZonedTime(new Date(instant), timeZone).getTime();
  }
  return new Date(instant);
};

export const formatDateTime = (
  value: DateInput | null | undefined,
  pattern: string = TIME_FORMATS.DATE_TIME,
  timeZone: string = getTimeZone(),
): string => {
  const date = parseDate(value);
  return date ? format(toZonedTime(date, timeZone), pattern) : TIME_TEXTS.INVALID_DATE;
};

export const formatTimeAgo = (value: DateInput | null | undefined): string => {
  const date = parseDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : TIME_TEXTS.INVALID_DATE;
};

export const toDateKey = (value: DateInput | null | undefined): string =>
  formatDateTime(value, TIME_FORMATS.DATE_KEY);

export const formatDateKey = (dateKey: string, pattern: string = TIME_FORMATS.DAY_HEADER): string =>
  format(parse(dateKey, TIME_FORMATS.DATE_KEY, new Date()), pattern);

const GO_TIME_DATE_REGEX =
  /time\.Date\((\d+),\s*time\.(\w+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*time\.Local\)/;

export const ParseGoTimeDate = (goTimeString: string): string => {
  if (!goTimeString || goTimeString === 'Unknown') {
    return new Date().toISOString();
  }

  // Handle Go time.Date format: time.Date(2025, time.September, 28, 12, 13, 1, 0, time.Local)
  const match = GO_TIME_DATE_REGEX.exec(goTimeString);

  if (match) {
    const [, year, monthName, day, hour, minute, second] = match;

    // Convert month name to number
    const monthMap: { [key: string]: number } = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const month = monthMap[monthName] || 0;
    const date = new Date(
      Number.parseInt(year),
      month,
      Number.parseInt(day),
      Number.parseInt(hour),
      Number.parseInt(minute),
      Number.parseInt(second),
    );
    return date.toISOString();
  }

  // If it's already a valid ISO string, return as is
  try {
    new Date(goTimeString);
    return goTimeString;
  } catch {
    // Fallback to current time
    return new Date().toISOString();
  }
};
