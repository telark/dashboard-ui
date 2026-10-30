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
  DOCS_LABEL: 'Documentation',
} as const;

export const HEADER_CONSTANTS = {
  USER: {
    AVATAR: {
      SIZE: 22,
      HOVER_SCALE: 1.05,
      TRANSITION: 'all 0.2s ease',
    },
    MENU: {
      WIDTH: 260,
      PLACEMENT: 'bottomRight' as const,
      ROOT_CLASS: 'user-menu-dropdown',
      TEXTS: {
        PROFILE: 'Profile',
        SECURITY: 'Security',
        MY_PERMISSIONS: 'My Permissions',
        LOGOUT: 'Logout',
      },
    },
    // The identity band above the menu items, the same SURFACE_SUBTLE band as the view panels' header.
    USER_INFO: {
      AVATAR_SIZE: 32,
      // The dropdown is a portal under the dark root theme, whose initials fallback is white on near-white
      // here, so it takes the light panels' fallback (PANEL_THEME's colorTextPlaceholder) instead.
      AVATAR_FALLBACK_BG: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
      AVATAR_FALLBACK_TEXT: DEFAULT_COLORS.PILL_TEXT,
      BACKGROUND: DEFAULT_COLORS.SURFACE_SUBTLE,
      BORDER_COLOR: DEFAULT_COLORS.SURFACE_BORDER_LIGHT,
      USERNAME_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE,
      EMAIL_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    },
    MENU_ICON_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  },
} as const;
