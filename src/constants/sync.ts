export const GROUPERS_REFRESH_INTERVAL_MS = 30000; // must match sync-manager GrouperSyncConfig.FetchInterval
export const GROUPERS_SYNC_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
export const GROUPERS_SYNC_LS_KEY = 'last_groupers_sync_ts';
export const WORKLOADS_REFRESH_INTERVAL_MS = 30000; // must match sync-manager WorkloadSyncConfig.FetchInterval
export const WORKLOADS_SYNC_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
export const WORKLOADS_SYNC_LS_KEY = 'last_workloads_sync_ts';

// Sync-related constants
export const SYNC_CONSTANTS = {
  // Message key prefix
  MESSAGE_KEY_PREFIX: 'sync-',

  // Polling configuration
  POLLING: {
    INTERVAL_MS: 250,
    MAX_WAIT_MS: 4000,
  },

  // Message durations
  MESSAGE_DURATIONS: {
    LOADING: 0,
    SUCCESS: 2,
    ERROR: 3,
  },

  // Default sync effect
  DEFAULT_SYNC_EFFECT: 'NoUpdate',

  // Effects that trigger polling
  POLLING_EFFECTS: ['Deleted', 'NotFound'] as const,

  // Error key
  ERROR_KEY: 'sync-error',
} as const;
