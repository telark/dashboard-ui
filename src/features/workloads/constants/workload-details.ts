import { SHARED_DETAILS_CONSTANTS } from '../../../constants/shared/details';

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
  METRICS: {
    TOTAL_USED_CPU: 'Total Used CPU',
    TOTAL_USED_MEMORY: 'Total Used Memory',
    QUALITY_OF_SERVICE: 'Quality of Service',
    AVAILABLE_TOTAL: 'Available / Total',
  },
} as const;

export type TabKey =
  (typeof WORKLOAD_DETAILS_CONSTANTS.TAB_KEYS)[keyof typeof WORKLOAD_DETAILS_CONSTANTS.TAB_KEYS];

