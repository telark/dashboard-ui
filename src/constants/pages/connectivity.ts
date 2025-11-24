export const CONNECTIVITY_CONSTANTS = {
  RETRY: {
    MAX_ATTEMPTS: 5,
    BASE_DELAY_MS: 1000,
    MAX_DELAY_MS: 30000,
    COUNTDOWN_INTERVAL_MS: 1000,
  },
  COOLDOWN: {
    DURATION_MS: 60000, // 1 minute
    AUTO_RETRY_DELAY_MS: 1000,
  },
  COLORS: {
    WARNING: '#F59E0B',
    TEXT_PRIMARY: '#0B1F33',
    TEXT_SECONDARY: '#5B6B7C',
    TEXT_MUTED: '#666',
    BACKGROUND_LIGHT: '#E5E7EB',
  },
  MESSAGES: {
    RETRYING: 'Retrying connection...',
    ERROR_COOLDOWN: 'Connection failed after multiple attempts. Cooling down before retry...',
    ERROR_RETRYING: 'Unable to connect to the server. Retrying automatically...',
    ERROR_RETRYING_COOLDOWN:
      'Unable to connect after multiple attempts. Starting cooldown period...',
    COOLDOWN_TITLE: 'Cooldown Period',
    COOLDOWN_DESCRIPTION: 'Retrying in {seconds} seconds...',
    ATTEMPT_COUNT: 'Attempt {current} of {max}',
    NEXT_RETRY: 'Next retry in {seconds} seconds...',
    CANCEL: 'Cancel',
    REFRESH: 'Refresh',
    CONNECTION_PROBLEM: 'Connection Problem',
  },
  LAYOUT: {
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
