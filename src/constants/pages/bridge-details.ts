import { SHARED_DETAILS_CONSTANTS } from '../shared/details';

export const BRIDGE_DETAILS_CONSTANTS = {
  TAB_KEYS: {
    GENERAL: 'general',
    RESOURCES: 'resources',
    HISTORY: 'history',
    SYNC: 'sync',
  },
  LAYOUT: {
    PAGE_CONTAINER: SHARED_DETAILS_CONSTANTS.LAYOUT.PAGE_CONTAINER,
    TABS_CONTAINER: SHARED_DETAILS_CONSTANTS.LAYOUT.TABS_CONTAINER,
    SECTION_CARD: {
      borderRadius: 16,
      boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
      border: 'none',
    },
    SECTION_CARD_BODY: SHARED_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY,
  },
  STATES: SHARED_DETAILS_CONSTANTS.STATES,
  SYNC: {
    ...SHARED_DETAILS_CONSTANTS.SYNC,
    MESSAGE_KEY_PREFIX: 'bridge-sync-',
    ERROR_KEY: 'bridge-sync-error',
  },
  MESSAGES: {
    ...SHARED_DETAILS_CONSTANTS.MESSAGES,
    ERROR: 'Error fetching bridge details:',
    EMPTY: 'No details available for this bridge.',
  },
} as const;

export type TabKey =
  (typeof BRIDGE_DETAILS_CONSTANTS.TAB_KEYS)[keyof typeof BRIDGE_DETAILS_CONSTANTS.TAB_KEYS];
