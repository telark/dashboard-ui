import { format, formatDistanceToNow, parse } from 'date-fns';
import { TIME_FORMATS, TIME_TEXTS, TIME_ZONE } from '../../constants/shared/time';
import { STORAGE_KEYS } from '../../constants/store/store';
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

// Every time label on a page reads the zone, so formatters and the resolved zone are
// cached: constructing Intl.DateTimeFormat per call froze pages with many labels.
let browserTimeZone: string | undefined;

export const getBrowserTimeZone = (): string => {
  browserTimeZone ??= Intl.DateTimeFormat().resolvedOptions().timeZone || TIME_ZONE.FALLBACK;
  return browserTimeZone;
};

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

const offsetFormatters = new Map<string, Intl.DateTimeFormat>();

export const formatTimeZoneOffset = (timeZone: string, date: Date = new Date()): string => {
  let formatter = offsetFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(TIME_ZONE.PARTS_LOCALE, {
      timeZone,
      timeZoneName: TIME_ZONE.OFFSET_NAME,
    });
    offsetFormatters.set(timeZone, formatter);
  }
  return formatter.formatToParts(date).find(({ type }) => type === 'timeZoneName')?.value ?? '';
};

// Keyed on the stored user string so a timezone change in Settings applies at once.
let cachedUserRaw: string | null | undefined;
let cachedTimeZone: string = TIME_ZONE.FALLBACK;

export const getTimeZone = (): string => {
  const raw = globalThis.localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (raw !== cachedUserRaw) {
    cachedUserRaw = raw;
    const preferred = getCurrentUser()?.settings?.timezone;
    cachedTimeZone = preferred && isValidTimeZone(preferred) ? preferred : getBrowserTimeZone();
  }
  return cachedTimeZone;
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
