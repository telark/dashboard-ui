export const GROUPERS_REFRESH_INTERVAL_MS = 30000; // must match sync-manager GrouperSyncConfig.FetchInterval
export const GROUPERS_SYNC_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
export const GROUPERS_SYNC_LS_KEY = 'last_groupers_sync_ts';
export const WORKLOADS_REFRESH_INTERVAL_MS = 30000; // must match sync-manager WorkloadSyncConfig.FetchInterval
export const WORKLOADS_SYNC_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
export const WORKLOADS_SYNC_LS_KEY = 'last_workloads_sync_ts';
export const BRIDGES_REFRESH_INTERVAL_MS = 30000; // must match sync-manager BridgeSyncConfig.FetchInterval
export const BRIDGES_SYNC_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
export const BRIDGES_SYNC_LS_KEY = 'last_bridges_sync_ts';
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
