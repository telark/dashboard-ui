import { COMMON_VALUES } from '../shared/common';
import { CONTROL_HEIGHT } from './controls';

export const BUTTON_TEXTS = {
  LOADING: 'In Progress...',
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
  RESET: 'Reset',
  APPLY: 'Apply',
} as const;

// Spacing between toolbar items, and between a toolbar and its neighbours, so
// the run of buttons reads as one evenly spaced group.
export const TOOLBAR_ITEM_GAP = 6;

// Every toolbar control sizes from here: the health pills set the row height,
// and buttons that pick their own padding drift out of line with them.
export const TOOLBAR_CONTROL = {
  HEIGHT: CONTROL_HEIGHT,
  PADDING: '0 10px',
  // Below this the labels no longer fit beside the sidebar, so every toolbar
  // control falls back to its icon and moves its label into a tooltip.
  COMPACT_BELOW: 768,
  COMPACT_QUERY: '(max-width: 767px)',
  // Without this the label box keeps its half-leading, so centring the box
  // leaves the glyphs off-centre against icons, which set their own.
  LINE_HEIGHT: 1,
} as const;

// The list-page toolbar row: selection, filter chips and count on the left,
// quick filters and actions on the right.
export const LIST_TOOLBAR = {
  ROW_HEIGHT_PX: 60,
  CLUSTER_GAP_PX: 8,
  SELECTION_PADDING_LEFT_PX: 16,
  META_FONT_SIZE_PX: 12,
  CHIP_GAP_PX: 6,
  CHIP_PADDING: '2px 8px',
  CHIP_FONT_SIZE_PX: 11,
  CHIP_FONT_WEIGHT: 600,
  PILL_RADIUS_PX: 999,
  // Also scopes the green checkbox styling in antd.css.
  BULK_SELECT_CLASS: 'app-bulk-select',
  CLEAR_ALL_LABEL: 'Clear All',
  SELECTED_SUFFIX: 'selected',
  OVERFLOW_SUFFIX: 'more',
  REMOVE_CHIP_LABEL: 'Remove filter',
  DATE_RANGE_KEY: 'dateRange',
  DATE_RANGE_ANY: 'Any',
  DATE_RANGE_SEPARATOR: 'to',
  // Chips beyond this collapse into a "+N more" chip.
  MAX_VISIBLE_CHIPS: 3,
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
    // Vertical space between consecutive items in the nav list; without it their
    // hover/active backgrounds touch edge-to-edge and read as one solid block.
    ITEM_GAP_PX: 4,
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
