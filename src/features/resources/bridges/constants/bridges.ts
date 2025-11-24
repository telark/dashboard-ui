import { SHARED_PAGE_CONSTANTS } from '../../../../constants/shared/pages';
import { SHARED_DETAILS_CONSTANTS } from '../../../../constants/shared/details';

export const BRIDGES_CONSTANTS = {
  UI: {
    EMPTY_STATE_MAX_WIDTH: SHARED_PAGE_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH,
  },
  MESSAGES: {
    LOADING: 'Loading bridges…',
    SUCCESS: 'Bridges loaded successfully!',
    NO_BRIDGES_TITLE: 'No bridges yet',
    NO_BRIDGES_DESCRIPTION:
      'When your cluster is connected, bridges represent your service connections. Make sure you have at least one bridge configured. Try syncing to pull the latest.',
  },
  LAYOUT: {
    EMPTY_STATE_CONTAINER: SHARED_PAGE_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER,
    EMPTY_ICON: SHARED_PAGE_CONSTANTS.LAYOUT.EMPTY_ICON,
  },
} as const;

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
