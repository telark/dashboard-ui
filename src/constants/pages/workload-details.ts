import { SHARED_DETAILS_CONSTANTS } from '../shared/details';

export const WORKLOAD_DETAILS_CONSTANTS = {
  TAB_KEYS: {
    GENERAL: 'general',
    INSTANCES: 'instances',
    BRIDGES: 'bridges',
    HISTORY: 'history',
    SYNC: 'sync',
  },
  LAYOUT: SHARED_DETAILS_CONSTANTS.LAYOUT,
  STATES: SHARED_DETAILS_CONSTANTS.STATES,
  SYNC: {
    ...SHARED_DETAILS_CONSTANTS.SYNC,
    MESSAGE_KEY_PREFIX: 'sync-app-',
    ERROR_KEY: 'sync-app-error',
  },
  MESSAGES: {
    ...SHARED_DETAILS_CONSTANTS.MESSAGES,
    ERROR: 'Error fetching workload details:',
    EMPTY: 'No details available for this workload.',
  },
} as const;

export type TabKey =
  (typeof WORKLOAD_DETAILS_CONSTANTS.TAB_KEYS)[keyof typeof WORKLOAD_DETAILS_CONSTANTS.TAB_KEYS];

