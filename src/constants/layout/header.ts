export const HEADER_CONSTANTS = {
  USER: {
    AVATAR: {
      SIZE: 22,
      BORDER_WIDTH: 1.5,
      HOVER_SCALE: 1.05,
      TRANSITION: 'all 0.2s ease',
    },
    MENU: {
      MIN_WIDTH: '200px',
      PLACEMENT: 'bottomRight' as const,
      TRIGGER: ['click'] as const,
    },
    USER_INFO: {
      PADDING: '8px 0',
      USERNAME: {
        FONT_WEIGHT: 500,
        FONT_SIZE: '14px',
        COLOR: '#0B1F33',
      },
      EMAIL: {
        FONT_SIZE: '12px',
        COLOR: '#999',
        MARGIN_TOP: '4px',
      },
    },
    MENU_ITEM: {
      GAP: '8px',
    },
    SETTINGS: {
      MESSAGE: 'Settings feature coming soon',
    },
    WARNINGS: {
      MISSING_USER_DATA:
        'Session token exists but user data is missing from localStorage. User may need to log in again.',
    },
  },
} as const;
