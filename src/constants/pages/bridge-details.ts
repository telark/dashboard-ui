import { DEFAULT_COLORS } from '../shared/colors';

export const BRIDGE_DETAILS_CONSTANTS = {
  TAB_KEYS: {
    GENERAL: 'general',
    RESOURCES: 'resources',
    HISTORY: 'history',
    SYNC: 'sync',
  } as const,
  LAYOUT: {
    PAGE_CONTAINER: {
      background: DEFAULT_COLORS.PAGE_BG,
      minHeight: '100vh',
      marginTop: 60,
      padding: '24px',
      paddingBottom: 64,
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
      marginBottom: 16,
    },
    SECTION_CARD: {
      borderRadius: 16,
      boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
      border: 'none',
      marginBottom: 16,
    },
    SECTION_CARD_BODY: {
      padding: 16,
    },
  },

  HEADER: {
    ICON_CONTAINER: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: 'rgba(32,201,151,0.12)',
      boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: DEFAULT_COLORS.SUCCESS,
      fontSize: 20,
    },
    TITLE_CONTAINER: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap' as const,
    },
    TITLE: {
      fontSize: 18,
      fontWeight: 700,
      color: '#0B1F33',
    },
    SUBTITLE: {
      color: '#5B6B7C',
      fontSize: 12,
      marginTop: 4,
    },
    BUTTON_CONTAINER: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    SYNC_BUTTON_CONTENT: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
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
    MESSAGE_KEY_PREFIX: 'bridge-sync-',
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
    ERROR_KEY: 'bridge-sync-error',
    TIMEOUT_MESSAGE: 'Taking a bit longer than usual. Please try again in a moment.',
  },
  FANCY_SPINNER: {
    SHOW_LABEL: false,
    SIZE: 18,
    RING_THICKNESS: 2,
  },
  MESSAGES: {
    LOADING: 'Loading...',
    ERROR: 'Error fetching bridge details:',
    EMPTY: 'No details available for this bridge.',
  },
} as const;

export type TabKey =
  (typeof BRIDGE_DETAILS_CONSTANTS.TAB_KEYS)[keyof typeof BRIDGE_DETAILS_CONSTANTS.TAB_KEYS];
