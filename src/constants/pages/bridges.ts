import { SHARED_PAGE_CONSTANTS } from '../shared/pages';

export const BRIDGES_PAGE_CONSTANTS = {
  RETRY: SHARED_PAGE_CONSTANTS.RETRY,
  COOLDOWN: SHARED_PAGE_CONSTANTS.COOLDOWN,
  UI: SHARED_PAGE_CONSTANTS.UI,
  COLORS: SHARED_PAGE_CONSTANTS.COLORS,
  MESSAGES: {
    ...SHARED_PAGE_CONSTANTS.MESSAGES,
    LOADING: 'Loading bridges…',
    SUCCESS: 'Bridges loaded successfully!',
    NO_BRIDGES_TITLE: 'No bridges yet',
    NO_BRIDGES_DESCRIPTION:
      'When your cluster is connected, bridges represent your service connections. Make sure you have at least one bridge configured. Try syncing to pull the latest.',
  },
  LAYOUT: SHARED_PAGE_CONSTANTS.LAYOUT,
} as const;
