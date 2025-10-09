import { COMMON_VALUES } from './common';

export const BUTTON_TEXTS = {
  LOADING: 'In Progress...',
} as const;

export const BUTTON_CONFIGS = {
  STATUS_BUTTON: {
    TYPE: 'default',
    BORDER_RADIUS: '18px',
    PADDING: '2px 8px',
    FONT_SIZE: '11px',
    HEIGHT: 26,
    LINE_HEIGHT: '22px',
    GAP: 4,
    ICON_FONT_SIZE: 12,
  },
  SIDEBAR_BUTTON: {
    PADDING: '12px 10px',
    BORDER_RADIUS: '10px',
    HEIGHT: 40,
    FONT_WEIGHT: 500,
    FONT_SIZE: 15,
    TRANSITION: 'all 180ms ease',
    BORDER_WIDTH: 3,
    COLLAPSED_MARGIN: '10px -12px 10px 0',
    EXPANDED_MARGIN: '10px -24px 10px 9.5px',
  },
  PRIMARY_BUTTON: {
    TYPE: 'primary',
    MARGIN_TOP: '20px',
    DISABLED_COLOR: '#d9d9d9',
  },
} as const;

export const BUTTON_COLORS = {
  ICON_DEFAULT: '#5B6B7C',
  TEXT_DEFAULT: '#0B1F33',
  DISABLED: '#d9d9d9',
} as const;

export const BUTTON_STATES = {
  STATUS: COMMON_VALUES.STATUS,
} as const;
