export const LOG_LEVEL_NAMES = {
  TRACE: 'trace',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  SILENT: 'silent',
} as const;
export type LogLevelName = (typeof LOG_LEVEL_NAMES)[keyof typeof LOG_LEVEL_NAMES];
export const DEFAULT_LOG_LEVELS = {
  DEVELOPMENT: LOG_LEVEL_NAMES.DEBUG,
  PRODUCTION: LOG_LEVEL_NAMES.WARN,
  TEST: LOG_LEVEL_NAMES.ERROR,
} as const;
