import { DEFAULT_COLORS } from '../shared/colors';

export const HEADER_LAYOUT = {
  HEIGHT_PX: 55,
  HEIGHT: '55px', //old 48px
  MIN_HEIGHT: 'calc(100vh - 55px)',
  LOGO: {
    SRC: '/telark-logo.svg',
    ALT: 'telark',
    WIDTH: 96,
    HEIGHT: 22,
    // Matches the left padding of BUTTON_CONFIGS.SIDEBAR_BUTTON so the logo
    // lines up with the sidebar menu items.
    LEFT_PX: 20,
    TOGGLE_GAP: 16,
  },
} as const;

export const HEADER_CONSTANTS = {
  USER: {
    AVATAR: {
      SIZE: 22,
      HOVER_SCALE: 1.05,
      TRANSITION: 'all 0.2s ease',
    },
    MENU: {
      MIN_WIDTH: '200px',
      PLACEMENT: 'bottomRight' as const,
      ROOT_CLASS: 'user-menu-dropdown',
    },
    USER_INFO: {
      // No bottom padding: the divider below relies on symmetric menu-item
      // padding to sit centred between the user block and the actions.
      PADDING: '8px 0 0',
      USERNAME: {
        FONT_WEIGHT: 500,
        FONT_SIZE: '14px',
        COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE,
      },
      EMAIL: {
        FONT_SIZE: '12px',
        COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
        MARGIN_TOP: '0px',
      },
    },
    MENU_ITEM: {
      GAP: '8px',
    },
    WARNINGS: {
      MISSING_USER_DATA:
        'Session token exists but user data is missing from localStorage. User may need to log in again.',
    },
  },
} as const;
