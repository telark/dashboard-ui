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
  OFFSET_NAME: 'shortOffset',
} as const;

export const TIME_CONFIGS = {
  UPDATE_INTERVAL: 60000, // 1 minute in milliseconds
} as const;

export const TIME_TEXTS = {
  INVALID_DATE: COMMON_VALUES.DATES.INVALID,
} as const;

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
