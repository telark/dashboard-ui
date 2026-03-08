import { DEFAULT_COLORS } from '../../../../constants';

export const ATTACHED_MEMBERS_CONSTANTS = {
  LIST: {
    EMPTY_STATE: {
      padding: '24px',
      textAlign: 'center' as const,
      color: DEFAULT_COLORS.TEXT_MUTED,
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
        background: DEFAULT_COLORS.BACKGROUND_LIGHT,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        borderRadius: 8,
        transition: 'all 0.2s ease',
        cursor: 'pointer' as const,
        minHeight: '48px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box' as const,
      },
      HOVER: {
        background: DEFAULT_COLORS.BACKGROUND_HOVER,
        borderColor: DEFAULT_COLORS.BORDER_HOVER,
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
      color: DEFAULT_COLORS.TEXT_PRIMARY,
      fontWeight: 500,
      lineHeight: 1.4,
    },
    MEMBER_EMAIL: {
      fontSize: 12,
      color: DEFAULT_COLORS.TEXT_MUTED,
      lineHeight: 1.3,
    },
  },
} as const;
