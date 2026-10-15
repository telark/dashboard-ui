import { DEFAULT_COLORS } from '../shared/colors';
import { CONTROL_HEIGHT } from './controls';
import { HEADER_LAYOUT } from './header';
import { SIDEBAR_LAYOUT } from './sidebar';

// Panels keep the light surface they had before the dark theme; these tokens
// re-light the antd controls rendered inside them.
export const PANEL_SURFACE_CLASS = 'app-panel-surface';

export const PANEL_THEME_TOKENS = {
  colorBgBase: DEFAULT_COLORS.SURFACE_WHITE,
  colorTextBase: DEFAULT_COLORS.TEXT_ON_SURFACE,
  colorBgContainer: DEFAULT_COLORS.SURFACE_WHITE,
  colorBgElevated: DEFAULT_COLORS.SURFACE_WHITE,
  colorText: DEFAULT_COLORS.TEXT_ON_SURFACE,
  colorTextPlaceholder: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  colorIcon: DEFAULT_COLORS.TEXT_ON_SURFACE,
  colorBorder: DEFAULT_COLORS.SURFACE_BORDER,
  // antd draws every keyboard focus ring in this color, and its light mint fades on white
  // (1.3:1). The muted ink (4.8:1) is also what inputs and selects show on focus here.
  colorPrimaryBorder: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
} as const;

// PanelThemePrewarm (idle timing and its offscreen box) and the panel theme's fixed css-var key.
export const PANEL_PREWARM = {
  CSS_VAR_KEY: 'tk-panel',
  IDLE_TIMEOUT_MS: 4000,
  // Safari has no requestIdleCallback.
  FALLBACK_DELAY_MS: 2000,
  CONTAINER: {
    position: 'fixed' as const,
    top: 0,
    left: -10000,
    width: 480,
    visibility: 'hidden' as const,
    pointerEvents: 'none' as const,
  },
} as const;

// antd paints the selected and active option with colorPrimary tints (green).
export const SELECT_THEME = {
  colorBgElevated: DEFAULT_COLORS.SURFACE_WHITE,
  optionSelectedBg: DEFAULT_COLORS.SURFACE_WHITE,
  optionActiveBg: DEFAULT_COLORS.SURFACE_HOVER,
  controlItemBgHover: DEFAULT_COLORS.SURFACE_HOVER,
  controlItemBgActiveHover: DEFAULT_COLORS.SURFACE_HOVER,
  colorTextDisabled: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
  multipleItemBg: DEFAULT_COLORS.SURFACE_WHITE,
  multipleItemBorderColor: DEFAULT_COLORS.SURFACE_BORDER,
  optionSelectedColor: DEFAULT_COLORS.TEXT_ON_SURFACE,
  activeBorderColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  hoverBorderColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  activeOutlineColor: 'transparent',
} as const;

// View panel tabs: antd paints the selected tab in colorPrimary, which fades on white (2.1:1).
export const PANEL_TABS_THEME = {
  itemColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  itemHoverColor: DEFAULT_COLORS.TEXT_ON_SURFACE,
  itemActiveColor: DEFAULT_COLORS.TEXT_ON_SURFACE,
  itemSelectedColor: DEFAULT_COLORS.TEXT_ON_SURFACE,
  inkBarColor: DEFAULT_COLORS.TEXT_ON_SURFACE,
  titleFontSize: 13,
  horizontalItemPadding: '9px 0',
  horizontalItemGutter: 22,
  horizontalMargin: '0 0 14px 0',
} as const;

// Expanded panels stop at a fully opened sidebar's edge so navigation stays reachable;
// small screens keep the panel's own width up to the viewport.
export const PANEL_MAX_WIDTH = `max(calc(100vw - ${SIDEBAR_LAYOUT.WIDTH_MAX}px), min(100vw, 480px))`;

// Panels slide in decelerating hard (nearly in place a third of the way through) and slide out
// faster, inert, so the motion never holds up the next click.
const PANEL_ENTER_MS = 220;
const PANEL_EXIT_MS = 160;
const PANEL_ENTER_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const PANEL_EXIT_EASING = 'cubic-bezier(0.4, 0, 1, 1)';
const PANEL_BODY_PADDING = 24;

export const SLIDE_OUT = {
  BACKDROP: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: DEFAULT_COLORS.OVERLAY_BACKDROP,
    zIndex: 1000,
    animation: `fadeIn ${PANEL_ENTER_MS}ms ease-out`,
  },
  PANEL: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    background: DEFAULT_COLORS.SURFACE_WHITE,
    zIndex: 1001,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    borderRight: `0.5px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
    animation: `slideInRight ${PANEL_ENTER_MS}ms ${PANEL_ENTER_EASING}`,
    transition: 'transform 0.3s ease, width 0.3s ease',
    willChange: 'transform',
    // Focused on open only to start the Tab order there; it draws no ring of its own.
    outline: 'none',
  },
  // prefers-reduced-motion: the panel appears and leaves in place, and expands without animating.
  NO_MOTION: { animation: 'none', transition: 'none' },
  EXIT: {
    PANEL: { transform: 'translateX(100%)' },
    BACKDROP: { opacity: 0 },
    TIMING: { duration: PANEL_EXIT_MS, easing: PANEL_EXIT_EASING, fill: 'forwards' as const },
  },
  // Exactly as tall as the app header (and follows it): the panel's top bar lines up with it.
  HEADER: {
    height: HEADER_LAYOUT.HEIGHT_PX,
    flexShrink: 0,
    boxSizing: 'border-box' as const,
    padding: '0 24px',
    borderBottom: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    justifyContent: 'center' as const,
  },
  HEADER_CONTENT: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  TOOLBAR: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  TOOLBAR_BUTTON: {
    background: 'none',
    border: 'none',
    cursor: 'pointer' as const,
    padding: 4,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    fontSize: 16,
    transition: 'color 0.2s',
    borderRadius: 4,
  },
  TOOLBAR_BUTTON_HOVER_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE,
  TOOLBAR_BUTTON_DEFAULT_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  TOOLBAR_BUTTON_DISABLED: {
    cursor: 'not-allowed' as const,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
  },
  // Plain buttons, out of antd's reach: index.css gives them the panel's focus ring.
  HEADER_BUTTON_CLASS: 'tk-panel-header-button',
  TOOLBAR_EDIT_LABEL: 'Edit',
  TOOLBAR_DELETE_LABEL: 'Delete',
  TITLE_CONTAINER: {
    flex: 1,
    minWidth: 0,
  },
  TITLE: {
    fontSize: 18,
    fontWeight: 700,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
    margin: 0,
    padding: 0,
    lineHeight: 1.2,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
  },
  ENTITY_TITLE: (title: string, name: string) => `${title} · ${name}`,
  CLOSE_BUTTON: {
    background: 'none',
    border: 'none',
    cursor: 'pointer' as const,
    padding: 4,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    fontSize: 18,
    transition: 'color 0.2s',
    borderRadius: 4,
  },
  CLOSE_BUTTON_HOVER_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE,
  CLOSE_BUTTON_DEFAULT_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  EXPAND_TOOLTIP: 'Expand panel for a wider layout',
  COLLAPSE_TOOLTIP: 'Collapse panel to default width',
  // Above the pinned footer the padded body still scrolls itself, so the scrollbar stays at the
  // panel edge.
  CONTENT: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: PANEL_BODY_PADDING,
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  FORM_CONTENT: {
    flex: 1,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 0,
  },
  KEYFRAMES: {
    SLIDE_IN_RIGHT: `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
    `,
    FADE_IN: `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  },
} as const;

// The one action footer of panels and dialogs (ActionButtons): Cancel, then the primary, on the
// right. The buttons' size, colors and spinner come from the App.tsx theme.
export const PANEL_FOOTER = {
  // Panels pin it in a bar that mirrors the header: as tall, 24px sides and a full-width line.
  BAR: {
    height: HEADER_LAYOUT.HEIGHT_PX,
    flexShrink: 0,
    boxSizing: 'border-box' as const,
    padding: '0 24px',
    borderTop: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'flex-end' as const,
  },
  ACTIONS: {
    display: 'flex' as const,
    justifyContent: 'flex-end' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  // Dialogs place it under their content, 12px below it with BaseModal's content gap.
  DIALOG: { marginTop: 6 },
  // The muted Cancel that inverts on hover (antd.css).
  CANCEL_CLASS: 'tk-footer-cancel',
} as const;

export const FILTER_PANEL = {
  TITLE: 'Filter',
  // A filter field is a form item like the panels' forms: compact label, 16px apart.
  ITEM_CLASS: 'form-item-compact',
  ITEM: { marginBottom: 16 },
  DATE_RANGE_CONTAINER: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  DATE_INPUT_WRAPPER: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 6,
    flex: 1,
  },
  DATE_INPUT: {
    width: '100%',
  },
  DATE_ARROW: {
    fontSize: 18,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    lineHeight: 1,
    height: 'fit-content' as const,
  },
  BUTTON_BASE: {
    all: 'unset' as const,
    cursor: 'pointer' as const,
    borderRadius: 20,
    height: CONTROL_HEIGHT,
    padding: '0 16px',
    fontSize: 13,
    fontFamily: "'Geist', sans-serif",
    transition: 'all 0.2s',
    fontWeight: 500,
  },
  BUTTON_ACTIVE: {
    fontWeight: 600,
    border: `1px solid ${DEFAULT_COLORS.SUCCESS}`,
    backgroundColor: DEFAULT_COLORS.SUCCESS,
    color: DEFAULT_COLORS.PILL_TEXT,
  },
  BUTTON_INACTIVE: {
    border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
    backgroundColor: DEFAULT_COLORS.SURFACE_WHITE,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  },
  DROPDOWN: {
    width: '100%',
  },
} as const;

export const FILTER_PANEL_CONFIG = {
  DATE_PLACEHOLDER: 'dd / mm / yyyy',
  DATE_FORMAT: 'DD / MM / YYYY',
} as const;

export const VIEW = {
  TAB_DETAILS_LABEL: 'Details',
  // The tab bar joins the header band: cancels CONTAINER's gap.
  TABS: { marginTop: -20 },
  // Carries the header band to the panel edges, through the body's padding.
  TAB_BAR: {
    background: DEFAULT_COLORS.SURFACE_SUBTLE,
    margin: `0 -${PANEL_BODY_PADDING}px 14px`,
    padding: `0 ${PANEL_BODY_PADDING}px`,
  },
  TAB_LABEL: { fontWeight: 500 },
  TAB_COUNT: {
    display: 'inline-block' as const,
    minWidth: 18,
    marginLeft: 6,
    padding: '0 5px',
    borderRadius: 4,
    background: DEFAULT_COLORS.CHIP_ON_SURFACE_BG,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    fontSize: 11,
    fontWeight: 600,
    lineHeight: '18px',
    textAlign: 'center' as const,
    fontVariantNumeric: 'tabular-nums',
  },
  TAB_COUNT_ACTIVE: {
    background: DEFAULT_COLORS.TEXT_ON_SURFACE,
    color: DEFAULT_COLORS.SURFACE_WHITE,
  },
  CONTAINER: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 20,
  },
  HEADER: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 14,
    margin: `-${PANEL_BODY_PADDING}px -${PANEL_BODY_PADDING}px 0`,
    padding: `${PANEL_BODY_PADDING}px ${PANEL_BODY_PADDING}px 18px`,
    background: DEFAULT_COLORS.SURFACE_SUBTLE,
    position: 'relative' as const,
  },
  ICON_SIZE: 40,
  // Leaves the 40px ring its 2px gap, like the actor avatars.
  AVATAR_SIZE: 36,
  GROUP_ICON_SIZE: 20,
  NAME_STACK: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 2,
    minWidth: 0,
  },
  TITLE: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.3,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
    letterSpacing: '-0.02em',
  },
  DESCRIPTION: {
    margin: 0,
    fontSize: 13,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    lineHeight: 1.4,
    wordBreak: 'break-word' as const,
  },
  DETAILS: {
    CONTAINER: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      gap: 16,
      paddingTop: 12,
    },
    ROW: {
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      gap: 12,
    },
    LABEL: {
      fontSize: 12,
      fontWeight: 700,
      color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.6,
    },
    VALUE: {
      display: 'flex' as const,
      alignItems: 'center' as const,
    },
  },
} as const;
