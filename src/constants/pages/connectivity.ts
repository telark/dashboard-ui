export const CONNECTIVITY_CONSTANTS = {
  RETRY: {
    MAX_ATTEMPTS: 5,
    BASE_DELAY_MS: 1000,
    MAX_DELAY_MS: 30000,
    COUNTDOWN_INTERVAL_MS: 1000,
  },
  COLORS: {
    WARNING: '#F59E0B',
    TEXT_PRIMARY: '#0B1F33',
    TEXT_SECONDARY: '#5B6B7C',
    TEXT_MUTED: '#666',
  },
  MESSAGES: {
    RETRYING: 'Retrying connection...',
    ERROR_RETRYING: 'Unable to connect to the server. Retrying automatically...',
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
  },
} as const;
