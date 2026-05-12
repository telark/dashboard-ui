export const DATA_VIEW_ERROR_CONSTANTS = {
  LABELS: {
    DEFAULT_TITLE: "Couldn't load this content",
    GENERIC_MESSAGE: 'Something went wrong while loading. Please try again.',
    TIMEOUT_MESSAGE: 'Taking longer than expected. Try again.',
    RETRY_BUTTON: 'Retry',
  },
  LAYOUT: {
    CARD: {
      MIN_HEIGHT: 280,
      PADDING: '48px 24px',
    },
    TABLE: {
      MIN_HEIGHT: 220,
      PADDING: '32px 24px',
    },
    ICON_SIZE: 40,
    GAP: 12,
  },
  TIMEOUT_MS: 15_000,
} as const;
