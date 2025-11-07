import { SHARED_DETAILS_CONSTANTS } from '../shared/details';

export const GROUPER_DETAILS_CONSTANTS = {
  TAB_KEYS: {
    GENERAL: 'general',
    RESOURCES: 'resources',
    HISTORY: 'history',
    SYNC: 'sync',
    MAINTENANCE: 'maintenance',
  },
  LAYOUT: SHARED_DETAILS_CONSTANTS.LAYOUT,
  STATES: SHARED_DETAILS_CONSTANTS.STATES,
  SYNC: {
    ...SHARED_DETAILS_CONSTANTS.SYNC,
    MESSAGE_KEY_PREFIX: 'grouper-sync-',
    ERROR_KEY: 'sync-error',
  },
  MESSAGES: {
    ...SHARED_DETAILS_CONSTANTS.MESSAGES,
    ERROR: 'Error fetching grouper details:',
    EMPTY: 'No details available for this grouper.',
  },
} as const;

export type TabKey =
  (typeof GROUPER_DETAILS_CONSTANTS.TAB_KEYS)[keyof typeof GROUPER_DETAILS_CONSTANTS.TAB_KEYS];
