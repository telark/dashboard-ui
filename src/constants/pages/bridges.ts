// Bridges page constants
export const BRIDGES_PAGE_CONSTANTS = {
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 5,
    BASE_DELAY_MS: 1000,
    MAX_DELAY_MS: 30000,
    COUNTDOWN_INTERVAL_MS: 1000,
  },

  // Cooldown configuration
  COOLDOWN: {
    DURATION_MS: 60000, // 1 minute
    AUTO_RETRY_DELAY_MS: 1000,
  },

  // UI dimensions and styling
  UI: {
    ICON_SIZE: 56,
    ICON_FONT_SIZE: 24,
    MARGIN_BOTTOM: 12,
    MAX_WIDTH: 500,
    EMPTY_STATE_MAX_WIDTH: 560,
    PROGRESS_BAR_HEIGHT: 8,
    PROGRESS_BAR_BORDER_RADIUS: 4,
  },

  // Colors
  COLORS: {
    WARNING: '#F59E0B',
    TEXT_PRIMARY: '#0B1F33',
    TEXT_SECONDARY: '#5B6B7C',
    TEXT_MUTED: '#666',
    BACKGROUND_LIGHT: '#E5E7EB',
  },

  // Messages
  MESSAGES: {
    LOADING: 'Loading bridges…',
    RETRYING: 'Retrying connection...',
    SUCCESS: 'Bridges loaded successfully!',
    ERROR_COOLDOWN: 'Connection failed after multiple attempts. Cooling down before retry...',
    ERROR_RETRYING: 'Unable to connect to the server. Retrying automatically...',
    ERROR_RETRYING_COOLDOWN:
      'Unable to connect after multiple attempts. Starting cooldown period...',
    COOLDOWN_TITLE: 'Cooldown Period',
    COOLDOWN_DESCRIPTION: 'Retrying in {seconds} seconds...',
    ATTEMPT_COUNT: 'Attempt {current} of {max}',
    NEXT_RETRY: 'Next retry in {seconds} seconds...',
    CANCEL: 'Cancel',
    NO_BRIDGES_TITLE: 'No bridges yet',
    NO_BRIDGES_DESCRIPTION:
      'When your cluster is connected, bridges represent your service connections. Make sure you have at least one bridge configured. Try syncing to pull the latest.',
    REFRESH: 'Refresh',
    CONNECTION_PROBLEM: 'Connection Problem',
  },

  // Layout styles
  LAYOUT: {
    LOADING_CONTAINER: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
    },
    ERROR_CONTAINER: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)',
      marginTop: '60px',
      width: '100%',
      padding: '20px',
    },
    ERROR_CONTENT: {
      textAlign: 'center' as const,
      maxWidth: 500,
    },
    EMPTY_STATE_CONTAINER: {
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
    },
    EMPTY_ICON: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'rgba(32,201,151,0.12)',
      boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      color: '#20C997',
      fontSize: 24,
    },
    PROGRESS_BAR_CONTAINER: {
      width: '100%',
      height: 8,
      backgroundColor: '#E5E7EB',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 16,
    },
    PROGRESS_BAR_FILL: {
      height: '100%',
      backgroundColor: '#F59E0B',
      transition: 'width 1s linear',
    },
  },
} as const;

