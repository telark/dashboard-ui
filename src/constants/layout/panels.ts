import { DEFAULT_COLORS } from '../shared/colors';

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
} as const;

export const SLIDE_OUT = {
  BACKDROP: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-in-out',
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
    animation: 'slideInRight 0.3s ease-out',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
  },
  HEADER: {
    padding: '16px 24px',
    borderBottom: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 4,
  },
  HEADER_CONTENT: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
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
  TITLE_CONTAINER: {
    flex: 1,
  },
  TITLE: {
    fontSize: 24,
    fontWeight: 700,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
    margin: 0,
    padding: 0,
    lineHeight: 1.2,
  },
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
  },
  CLOSE_BUTTON_HOVER_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE,
  CLOSE_BUTTON_DEFAULT_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  EXPAND_TOOLTIP: 'Expand panel for a wider layout',
  COLLAPSE_TOOLTIP: 'Collapse panel to default width',
  CONTENT: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  FORM: {
    height: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  FORM_CONTENT: {
    flex: 1,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 0,
  },
  FOOTER: {
    paddingTop: 6,
    paddingBottom: 6,
    borderTop: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
    display: 'flex' as const,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginTop: 16,
  },
  CANCEL_BUTTON: {
    background: 'none',
    border: 'none',
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer' as const,
    padding: '4px 16px',
    borderRadius: 6,
    transition: 'all 0.2s',
  },
  CANCEL_BUTTON_HOVER_BACKGROUND: DEFAULT_COLORS.TEXT_ON_SURFACE,
  CANCEL_BUTTON_DEFAULT_BACKGROUND: 'none',
  CANCEL_BUTTON_HOVER_COLOR: DEFAULT_COLORS.SURFACE_WHITE,
  CANCEL_BUTTON_DEFAULT_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
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

export const FILTER_PANEL = {
  BACKDROP: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1002,
    animation: 'fadeIn 0.2s ease-in-out',
  },
  PANEL: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    background: DEFAULT_COLORS.SURFACE_WHITE,
    zIndex: 1003,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    borderRight: `0.5px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
    animation: 'slideInRight 0.3s ease-out',
  },
  CONTENT: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 32,
  },
  SECTION: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 8,
  },
  SECTION_TITLE: {
    fontSize: 12,
    fontWeight: 600,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    fontFamily: "'Geist', sans-serif",
  },
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
  DATE_LABEL: {
    fontSize: 13,
    fontWeight: 500,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    lineHeight: '20px',
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
    height: 32,
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
    color: '#fff',
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
  CONTAINER: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 20,
  },
  HEADER: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingBottom: 20,
    borderBottom: '1px solid #eef2f6',
    position: 'relative' as const,
  },
  ICON_WRAPPER: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: DEFAULT_COLORS.SURFACE_WHITE,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    border: '2px solid rgba(32, 201, 151, 0.35)',
  },
  NAME_STACK: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: 0,
    marginTop: -4,
  },
  TITLE: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
    letterSpacing: '-0.02em',
    textTransform: 'capitalize' as const,
  },
  DESCRIPTION: {
    margin: '0 0 4px 0',
    fontSize: 13,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    textAlign: 'center' as const,
    maxWidth: '360px',
    lineHeight: 1.4,
    wordBreak: 'break-word' as const,
  },
  AVATAR_ROW: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginTop: 4,
  },
  AVATAR: {
    border: '1.5px solid #20C997',
    padding: 1.5,
    background: DEFAULT_COLORS.SURFACE_WHITE,
    boxSizing: 'border-box' as const,
    boxShadow: '0 0 0 2px #fff',
  },
  OVERFLOW_BADGE: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#20C997',
    color: '#fff',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontWeight: 700,
    fontSize: 12,
    marginLeft: -6,
    boxShadow: '0 0 0 3px #fff',
    zIndex: 1,
    cursor: 'default' as const,
  },
  OVERFLOW_TOOLTIP: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 6,
  },
  OVERFLOW_TOOLTIP_ITEM: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  OVERFLOW_USERNAME: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
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
