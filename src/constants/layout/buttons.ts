import { CONTROL_HEIGHT, SPACING } from './controls';
import { SIDEBAR_LAYOUT } from './sidebar';
import { DEFAULT_COLORS } from '../shared/colors';

export const BUTTON_TEXTS = {
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
  SAVE_CHANGES: 'Save changes',
  RESET: 'Reset',
  APPLY: 'Apply',
  CLOSE: 'Close',
  SELECT: 'Select',
} as const;

// Strips a button's chrome but, unlike `all: 'unset'`, keeps its focus ring.
export const UNSTYLED_BUTTON = {
  background: 'none',
  border: 'none',
  padding: SPACING.NONE,
  cursor: 'pointer',
} as const;

// Spacing between toolbar items, and between a toolbar and its neighbors, so
// the run of buttons reads as one evenly spaced group.
export const TOOLBAR_ITEM_GAP = 6;

// Every toolbar control sizes from here: the health pills set the row height,
// and buttons that pick their own padding drift out of line with them.
export const TOOLBAR_CONTROL = {
  HEIGHT: CONTROL_HEIGHT,
  PADDING: '0 10px',
  // Below this the labels no longer fit beside the sidebar, so every toolbar
  // control falls back to its icon and moves its label into a tooltip.
  COMPACT_QUERY: SIDEBAR_LAYOUT.FORCE_COLLAPSE_QUERY,
  // Without this the label box keeps its half-leading, so centering the box
  // leaves the glyphs off-center against icons, which set their own.
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
  // Quick-filter pills are unstyled buttons: this class gives them back a keyboard focus ring.
  QUICK_FILTER_CLASS: 'tk-quick-filter',
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
    // The phone rail's icon over its short name: the box widens to fit "Members" in 52px.
    RAIL: { MARGIN_X: 2, PADDING: '4px 0', GAP: 2, LABEL_FONT_SIZE: 10, LABEL_LINE_HEIGHT: '12px' },
  },
  PRIMARY_BUTTON: {
    FONT_WEIGHT: 600,
    // White fails AA on the brand green; this dark text passes (about 8:1).
    TEXT_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE,
  },
} as const;

export const BUTTON_COLORS = {
  ICON_DEFAULT: DEFAULT_COLORS.TEXT_MUTED,
  TEXT_DEFAULT: DEFAULT_COLORS.TEXT_PRIMARY,
  // Light surfaces (panels) re-point this var so toolbars stay readable there.
  TOOLBAR_TEXT: `var(--app-toolbar-text-color, ${DEFAULT_COLORS.TEXT_PRIMARY})`,
  TOOLBAR_BORDER: `var(--app-toolbar-border-color, ${DEFAULT_COLORS.BORDER_DEFAULT})`,
  TOOLBAR_DISABLED_TEXT: `var(--app-toolbar-disabled-color, ${DEFAULT_COLORS.TEXT_DISABLED})`,
  TOOLBAR_HOVER_BG: `var(--app-toolbar-hover-bg, ${DEFAULT_COLORS.SURFACE_WHITE})`,
  // Re-pointed the same way for other shared parts: muted text and the Switch's unchecked track.
  MUTED_TEXT: `var(--app-muted-text-color, ${DEFAULT_COLORS.TEXT_MUTED})`,
  SWITCH_OFF: `var(--app-switch-off-color, ${DEFAULT_COLORS.BORDER_DEFAULT})`,
} as const;
