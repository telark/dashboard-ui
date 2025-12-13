import { DEFAULT_COLORS } from '../../../../constants';

export const ATTACHED_ROLES_CONSTANTS = {
  FILTER: {
    CONTAINER: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
      width: '100%',
    },
    LABEL: {
      fontSize: 13,
      fontWeight: 600,
      color: '#64748b',
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      fontFamily: "'Roboto Condensed', sans-serif",
    },
    BUTTON: {
      BASE: {
        all: 'unset' as const,
        cursor: 'pointer' as const,
        borderRadius: 20,
        height: 28,
        padding: '0 16px',
        fontSize: 13,
        fontFamily: "'Roboto Condensed', sans-serif",
        transition: 'all 0.2s',
      },
      ACTIVE: {
        fontWeight: 600,
        border: `1px solid ${DEFAULT_COLORS.SUCCESS}`,
        backgroundColor: DEFAULT_COLORS.SUCCESS,
        color: '#fff',
      },
      INACTIVE: {
        fontWeight: 500,
        border: '1px solid #d9d9d9',
        backgroundColor: '#fff',
        color: '#64748b',
      },
    },
  },
  LIST: {
    EMPTY_STATE: {
      padding: '24px',
      textAlign: 'center' as const,
      color: '#64748b',
    },
    CONTAINER: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 8,
      maxHeight: 'calc(100vh - 300px)',
      overflowY: 'auto' as const,
      width: '100%',
      padding: '0 0px',
      boxSizing: 'border-box' as const,
      alignItems: 'stretch' as const,
    },
    ITEM: {
      BASE: {
        display: 'flex',
        alignItems: 'flex-start' as const,
        padding: '5px 14px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        transition: 'all 0.2s ease',
        cursor: 'pointer' as const,
        minHeight: '48px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box' as const,
      },
      HOVER: {
        background: '#f1f5f9',
        borderColor: '#cbd5e1',
      },
    },
    ROLE_NAME: {
      fontSize: 14,
      color: '#0B1F33',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    ROLE_DESCRIPTION: {
      fontSize: 12,
      color: '#64748b',
      marginTop: 2,
      lineHeight: 1.3,
      overflow: 'hidden' as const,
      textOverflow: 'ellipsis' as const,
      whiteSpace: 'nowrap' as const,
    },
    ROLE_CONTENT: {
      flex: 1,
      minWidth: 0,
    },
    ROLE_SCOPES: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 6,
      marginTop: 4,
    },
    SCOPE_ITEM: {
      fontSize: 11,
      color: '#64748b',
      padding: '2px 6px',
      background: '#f1f5f9',
      borderRadius: 4,
      border: '1px solid #e2e8f0',
      lineHeight: 1.4,
    },
  },
  TOOLTIPS: {
    PROTECTED_ROLE: 'This role is protected from deletion and modification',
  },
} as const;
