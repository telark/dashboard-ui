export const SYNC_CONSTANTS = {
  MESSAGE_KEY_PREFIX: 'sync-',
  TIMEOUT_MESSAGE: 'Taking a bit longer than usual. Please try again in a moment.',
  APPLICATION_FORCE_SYNC_TIMEOUT_MS: 190000,
  POLLING: {
    INTERVAL_MS: 250,
    MAX_WAIT_MS: 4000,
  },
  MESSAGE_DURATIONS: {
    LOADING: 0,
    SUCCESS: 2,
    ERROR: 3,
  },
  DEFAULT_SYNC_EFFECT: 'NoUpdate',
  POLLING_EFFECTS: ['Deleted', 'NotFound'] as const,
  ERROR_KEY: 'sync-error',
} as const;
