export const ATTACHED_MEMBERS_CONSTANTS = {
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
        alignItems: 'center' as const,
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
    MEMBER_CONTENT: {
      display: 'flex',
      alignItems: 'center' as const,
      gap: 12,
      width: '100%',
    },
    MEMBER_AVATAR_CONTAINER: {
      display: 'flex',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    MEMBER_INFO: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 2,
      flex: 1,
    },
    MEMBER_NAME: {
      fontSize: 14,
      color: '#0B1F33',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    MEMBER_EMAIL: {
      fontSize: 12,
      color: '#64748b',
      lineHeight: 1.3,
    },
  },
} as const;
