export const UTILS_TEXTS = {
  ERRORS: {
    INVALID_DATA_FORMAT: 'Invalid data format from the API',
    MISSING_DATA: 'Missing expected data in the response.',
  },
  DEFAULTS: {
    EMPTY_STRING: '',
    ZERO: 0,
  },
} as const;

export const ENV = {
  DEV: 'development',
  PROD: 'production',
} as const;
