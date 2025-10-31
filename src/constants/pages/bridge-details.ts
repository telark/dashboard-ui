import { DEFAULT_COLORS } from '../colors';

// BridgeDetails page constants
export const BRIDGE_DETAILS_CONSTANTS = {
  // Tab keys
  TAB_KEYS: {
    GENERAL: 'general',
    RESOURCES: 'resources',
    HISTORY: 'history',
    SYNC: 'sync',
  } as const,

  // Sync configuration
  SYNC: {
    MESSAGE_KEY_PREFIX: 'bridge-sync-',
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
    ERROR_KEY: 'bridge-sync-error',
    TIMEOUT_MESSAGE: 'Taking a bit longer than usual. Please try again in a moment.',
  },
} as const;

export type TabKey =
  (typeof BRIDGE_DETAILS_CONSTANTS.TAB_KEYS)[keyof typeof BRIDGE_DETAILS_CONSTANTS.TAB_KEYS];

