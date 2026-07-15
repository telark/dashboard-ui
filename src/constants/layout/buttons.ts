import { COMMON_VALUES } from '../shared/common';

export const BUTTON_TEXTS = {
  LOADING: 'In Progress...',
} as const;

// Spacing between toolbar items, and between a toolbar and its neighbours, so
// the run of buttons reads as one evenly spaced group.
export const TOOLBAR_ITEM_GAP = 6;

// Every toolbar control sizes from here: the health pills set the row height,
// and buttons that pick their own padding drift out of line with them.
export const TOOLBAR_CONTROL = {
  HEIGHT: 28,
  PADDING: '0 10px',
  // Without this the label box keeps its half-leading, so centring the box
  // leaves the glyphs off-centre against icons, which set their own.
  LINE_HEIGHT: 1,
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
    // Margin + left padding together keep the icon at 20px from the sidebar edge
    // while the box starts short of it, so the icon never touches the box edge.
    MARGIN_LEFT: 8,
    MARGIN_RIGHT: 8,
    COLLAPSED_MARGIN_X: 8,
    PADDING: '0 12px 0 12px',
    BORDER_RADIUS: '6px',
    HEIGHT: 36,
    GAP: 10,
    FONT_WEIGHT: 500,
    FONT_SIZE: 13,
    TRANSITION: 'background-color 150ms ease, color 150ms ease, opacity 150ms ease',
    // Width of the active bar drawn by the settings sidebar.
    BORDER_WIDTH: 2,
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
  // Light surfaces (panels) re-point this var so toolbars stay readable there.
  TOOLBAR_TEXT: 'var(--app-toolbar-text-color, #ffffff)',
} as const;

export const BUTTON_STATES = {
  STATUS: COMMON_VALUES.STATUS,
} as const;
