import { COMMON_VALUES } from './common';

export const TIME_FORMATS = {
  DEFAULT: 'eee, d MMM yyyy',
  FULL: 'EEEE, MMMM do, yyyy',
  SHORT: 'MMM d, yyyy',
  TIME_ONLY: 'HH:mm:ss',
  DATE_TIME: 'MMM d, yyyy HH:mm',
  DATE_TIME_12H: 'MMM d, yyyy h:mm a',
  LONG_DATE_TIME_12H: 'MMMM d, yyyy h:mm a',
  DAY_HEADER: 'MMMM d, yyyy',
  DATE_KEY: 'yyyy-MM-dd',
} as const;

export const TIME_ZONE = {
  FALLBACK: 'UTC',
  PARTS_LOCALE: 'en-US',
  HOUR_CYCLE: 'h23',
  OFFSET_NAME: 'longOffset',
  // Intl writes GMT+02:00, or a bare GMT at zero offset: labels read UTC+02:00 and UTC+00:00.
  INTL_OFFSET_PREFIX: 'GMT',
  OFFSET_PREFIX: 'UTC',
  ZERO_OFFSET_LABEL: 'UTC+00:00',
} as const;

export const TIME_CONFIGS = {
  UPDATE_INTERVAL: 60000, // 1 minute in milliseconds
  MS_PER_SECOND: 1000,
} as const;

export const TIME_TEXTS = {
  INVALID_DATE: COMMON_VALUES.DATES.INVALID,
  JUST_NOW: 'just now',
  AGO_SHORT: (count: number, unit: string) => `${count}${unit} ago`,
} as const;

// Compact relative time ("5h ago"), largest unit first, as [suffix, seconds].
export const TIME_AGO_SHORT_UNITS: readonly (readonly [string, number])[] = [
  ['y', 31536000],
  ['mo', 2592000],
  ['d', 86400],
  ['h', 3600],
  ['m', 60],
];

export const TIME_REMAINING = {
  ENDED: 'Ended',
  UNIT_DAY: 'd',
  UNIT_HOUR: 'h',
  UNIT_MINUTE: 'm',
  UNIT_SECOND: 's',
  TICK_SLOW_MS: 30000,
  TICK_FAST_MS: 1000,
  FAST_THRESHOLD_SEC: 60,
} as const;
