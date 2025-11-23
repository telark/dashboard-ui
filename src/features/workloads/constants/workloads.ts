import { SHARED_PAGE_CONSTANTS } from '../../../constants/shared/pages';
import { SHARED_DETAILS_CONSTANTS } from '../../../constants/shared/details';

export const WORKLOADS_CONSTANTS = {
  RETRY: SHARED_PAGE_CONSTANTS.RETRY,
  COOLDOWN: SHARED_PAGE_CONSTANTS.COOLDOWN,
  UI: SHARED_PAGE_CONSTANTS.UI,
  COLORS: SHARED_PAGE_CONSTANTS.COLORS,
  MESSAGES: {
    ...SHARED_PAGE_CONSTANTS.MESSAGES,
    LOADING: 'Loading workloads…',
    SUCCESS: 'Workloads loaded successfully!',
    NO_WORKLOADS_TITLE: 'No workloads yet',
    NO_WORKLOADS_DESCRIPTION:
      'When your cluster is connected, workloads will be displayed here. Make sure you have workloads running in your cluster. Try syncing to pull the latest.',
    WORKLOAD_NOT_FOUND: 'Workload not found',
    WORKLOAD_NOT_FOUND_DESCRIPTION: 'The workload could not be found.',
  },
  LAYOUT: SHARED_PAGE_CONSTANTS.LAYOUT,
} as const;

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
