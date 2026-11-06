import { HEADER_LAYOUT } from '../layout/header';
import { DEFAULT_COLORS } from '../shared/colors';

export const CONNECTIVITY_CONSTANTS = {
  RETRY: {
    MAX_ATTEMPTS: 5,
    BASE_DELAY_MS: 1000,
    MAX_DELAY_MS: 30000,
    COUNTDOWN_INTERVAL_MS: 1000,
  },
  COLORS: {
    WARNING: DEFAULT_COLORS.WARNING,
    TEXT_PRIMARY: DEFAULT_COLORS.TEXT_ON_SURFACE,
    TEXT_SECONDARY: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    TEXT_MUTED: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  },
  MESSAGES: {
    RETRYING: 'Retrying connection...',
    ERROR_RETRYING: 'Unable to connect to the server. Retrying automatically...',
    ATTEMPT_COUNT: 'Attempt {current} of {max}',
    NEXT_RETRY: 'Next retry in {seconds} seconds...',
    CANCEL: 'Cancel',
    CONNECTION_PROBLEM: 'Connection Problem',
  },
  // One state for every feature, whether the network or a service is down.
  UNREACHABLE: {
    TITLE: "Can't reach the server",
    MESSAGE:
      'Your connection dropped or the server is out of reach. Nothing was lost — reconnect and pick up where you left off.',
    RETRY_BUTTON: 'Try again',
    ACTION_TOOLTIP: 'Unavailable while the server is out of reach',
  },
  LAYOUT: {
    ERROR_CONTAINER: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: HEADER_LAYOUT.MIN_HEIGHT,
      width: '100%',
      padding: '20px',
    },
    ERROR_CONTENT: {
      textAlign: 'center' as const,
      maxWidth: 500,
    },
  },
} as const;
