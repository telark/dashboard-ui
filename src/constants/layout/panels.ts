import { DEFAULT_COLORS } from '../shared/colors';

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
    background: '#fff',
    zIndex: 1001,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
    animation: 'slideInRight 0.3s ease-out',
  },
  HEADER: {
    padding: '16px 24px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 4,
  },
  HEADER_CONTENT: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
  },
  TITLE_CONTAINER: {
    flex: 1,
  },
  TITLE: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0B1F33',
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
    color: '#64748b',
    fontSize: 18,
    transition: 'color 0.2s',
  },
  CLOSE_BUTTON_HOVER_COLOR: '#0B1F33',
  CLOSE_BUTTON_DEFAULT_COLOR: '#64748b',
  CONTENT: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px 32px',
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
    paddingTop: 24,
    borderTop: '1px solid #f0f0f0',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    gap: 12,
    marginTop: 'auto' as const,
  },
  CANCEL_BUTTON: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer' as const,
    padding: '8px 16px',
    borderRadius: 6,
    transition: 'all 0.2s',
  },
  CANCEL_BUTTON_HOVER_BACKGROUND: DEFAULT_COLORS.HOVER_BG,
  CANCEL_BUTTON_DEFAULT_BACKGROUND: 'none',
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
    background: '#fff',
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
    color: '#0B1F33',
    letterSpacing: '-0.02em',
    textTransform: 'capitalize' as const,
  },
  DESCRIPTION: {
    margin: '0 0 4px 0',
    fontSize: 13,
    color: '#64748b',
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
    background: '#fff',
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
      color: '#6b7280',
      textTransform: 'uppercase' as const,
      letterSpacing: 0.6,
    },
    VALUE: {
      display: 'flex' as const,
      alignItems: 'center' as const,
    },
  },
} as const;
