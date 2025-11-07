import { DEFAULT_COLORS } from '../shared/colors';

export const WORKLOAD_DETAILS_CONSTANTS = {
  TAB_KEYS: {
    GENERAL: 'general',
    INSTANCES: 'instances',
    BRIDGES: 'bridges',
    HISTORY: 'history',
    SYNC: 'sync',
  } as const,
  LAYOUT: {
    PAGE_CONTAINER: {
      background: DEFAULT_COLORS.PAGE_BG,
      minHeight: 'calc(100vh - 60px)',
      marginTop: '60px',
      padding: '48px 24px 48px',
    },
    HEADER_CONTAINER: {
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
      padding: 16,
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    },
    TABS_CONTAINER: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      background: 'linear-gradient(180deg, rgba(239,244,250,0.6), rgba(239,244,250,0))',
      padding: '8px 0',
      borderRadius: 24,
    },
    SECTION_CARD: {
      borderRadius: 16,
      boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
      border: 'none',
      marginBottom: 16,
      background: '#fff',
    },
    SECTION_CARD_BODY: {
      padding: 16,
    },
  },
  STATES: {
    LOADING_CONTAINER: {
      marginTop: 60,
      padding: 24,
    },
    ERROR_CONTAINER: {
      marginTop: 60,
      padding: 24,
    },
    EMPTY_CONTAINER: {
      marginTop: 60,
      padding: 24,
    },
  },
  SYNC: {
    MESSAGE_KEY_PREFIX: 'sync-app-',
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
    ERROR_KEY: 'sync-app-error',
    TIMEOUT_MESSAGE: 'Taking a bit longer than usual. Please try again in a moment.',
  },
  MESSAGES: {
    LOADING: 'Loading...',
    ERROR: 'Error fetching workload details:',
    EMPTY: 'No details available for this workload.',
  },
} as const;

export type TabKey =
  (typeof WORKLOAD_DETAILS_CONSTANTS.TAB_KEYS)[keyof typeof WORKLOAD_DETAILS_CONSTANTS.TAB_KEYS];

