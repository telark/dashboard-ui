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
  CANCEL_BUTTON_HOVER_BACKGROUND: '#f5f5f5',
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
