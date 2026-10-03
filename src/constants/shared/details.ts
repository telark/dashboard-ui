import { DEFAULT_COLORS } from './colors';
import { HEADER_LAYOUT } from '../layout/header';

export const SHARED_DETAILS_CONSTANTS = {
  LAYOUT: {
    PAGE_CONTAINER: {
      background: DEFAULT_COLORS.PAGE_BG,
      minHeight: HEADER_LAYOUT.MIN_HEIGHT,
      padding: '48px 24px 48px',
    },
    SECTION_CARD_BODY: {
      padding: 16,
    },
  },
  STATES: {
    LOADING_CONTAINER: {
      padding: 24,
    },
    ERROR_CONTAINER: {
      padding: 24,
    },
    EMPTY_CONTAINER: {
      padding: 24,
    },
  },
  SYNC: {
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
    TIMEOUT_MESSAGE: 'Taking a bit longer than usual. Please try again in a moment.',
  },
  MESSAGES: {
    LOADING: 'Loading...',
  },
} as const;
