export const CONNECTIVITY_BANNER = {
  LABELS: {
    SERVICE: {
      TITLE: 'Service temporarily unavailable',
      TITLE_NAMED: (service: string) => `${service} is temporarily unavailable`,
      MESSAGE:
        'We paused requests while the service recovers, so the rest of the app keeps working. This usually clears on its own.',
    },
    NETWORK: {
      TITLE: "Can't reach the server",
      MESSAGE:
        'Your connection dropped or the server is out of reach. Nothing was lost — reconnect and pick up where you left off.',
    },
    RETRY_BUTTON: 'Try again',
  },
  LAYOUT: {
    RADIUS: 12,
    PADDING: '15px 16px',
    GAP: 14,
    ICON_SIZE: 17,
    ICON_BOX: 36,
    ICON_RADIUS: 11,
    PULSE_SIZE: 6,
    TITLE_FONT_SIZE: 13,
    MESSAGE_FONT_SIZE: 12,
    MAX_MESSAGE_WIDTH: 620,
    PULSE_ANIMATION: 'connectivityBannerPulse 1.8s ease-in-out infinite',
  },
} as const;
