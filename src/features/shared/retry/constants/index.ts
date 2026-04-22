export const RETRY_STATUS = {
  IDLE: 'idle',
  RETRYING: 'retrying',
  FAILED: 'failed',
  SUCCESS: 'success',
} as const;

export const RETRY_DEFAULTS = {
  MAX_ATTEMPTS: 5,
  BACKOFF_INTERVALS_MS: [1000, 2000, 4000, 8000, 15000],
  PAUSE_CHECK_INTERVAL_MS: 1000,
} as const;
