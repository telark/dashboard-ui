import { SHARED_PAGE_CONSTANTS } from '../../../../constants/shared/pages';
import { SHARED_DETAILS_CONSTANTS } from '../../../../constants/shared/details';

export const GROUPERS_CONSTANTS = {
  UI: {
    EMPTY_STATE_MAX_WIDTH: SHARED_PAGE_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH,
  },
  MESSAGES: {
    LOADING: 'Loading groupers…',
    SUCCESS: 'Groupers loaded successfully!',
    NO_GROUPERS_TITLE: 'No groupers yet',
    NO_GROUPERS_DESCRIPTION:
      "When your cluster is connected, groupers represent your namespaces. Make sure you have at least one namespace (excluding any you've set to be ignored in Settings). Try syncing to pull the latest.",
  },
  LAYOUT: {
    EMPTY_STATE_CONTAINER: SHARED_PAGE_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER,
    EMPTY_ICON: SHARED_PAGE_CONSTANTS.LAYOUT.EMPTY_ICON,
  },
} as const;

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
