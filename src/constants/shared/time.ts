import { COMMON_VALUES } from './common';

export const TIME_FORMATS = {
  DEFAULT: 'eee, d MMM yyyy',
  FULL: 'EEEE, MMMM do, yyyy',
  SHORT: 'MMM d, yyyy',
  TIME_ONLY: 'HH:mm:ss',
  DATE_TIME: 'MMM d, yyyy HH:mm',
} as const;

export const TIME_CONFIGS = {
  UPDATE_INTERVAL: 60000, // 1 minute in milliseconds
} as const;

export const TIME_TEXTS = {
  INVALID_DATE: COMMON_VALUES.DATES.INVALID,
} as const;
