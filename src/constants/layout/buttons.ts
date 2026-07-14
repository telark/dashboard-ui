import { COMMON_VALUES } from '../shared/common';

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
    PADDING: '0 10px 0 12px',
    BORDER_RADIUS: '6px',
    HEIGHT: 36,
    FONT_WEIGHT: 500,
    FONT_SIZE: 13,
    TRANSITION:
      'background-color 150ms ease, color 150ms ease, border-right-color 150ms ease, opacity 150ms ease',
    BORDER_WIDTH: 2,
    COLLAPSED_MARGIN: '0',
    EXPANDED_MARGIN: '0',
  },
  PRIMARY_BUTTON: {
    TYPE: 'primary',
    MARGIN_TOP: '0px',
    DISABLED_COLOR: '#d9d9d9',
  },
} as const;

export const BUTTON_COLORS = {
  ICON_DEFAULT: '#9ca3af',
  TEXT_DEFAULT: '#ffffff',
  DISABLED: '#d9d9d9',
} as const;

export const BUTTON_STATES = {
  STATUS: COMMON_VALUES.STATUS,
} as const;
