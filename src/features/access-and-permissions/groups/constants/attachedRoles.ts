import { CONTROL_HEIGHT, DEFAULT_COLORS, getPillSurface } from '../../../../constants';

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
      color: DEFAULT_COLORS.TEXT_MUTED,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    BUTTON: {
      BASE: {
        all: 'unset' as const,
        cursor: 'pointer' as const,
        borderRadius: 20,
        height: CONTROL_HEIGHT,
        padding: '0 16px',
        fontSize: 13,
        transition: 'all 0.2s',
      },
      ACTIVE: {
        fontWeight: 600,
        border: `1px solid ${DEFAULT_COLORS.SUCCESS}`,
        backgroundColor: DEFAULT_COLORS.SUCCESS,
        color: DEFAULT_COLORS.BACKGROUND_WHITE,
      },
      INACTIVE: {
        fontWeight: 500,
        border: `1px solid ${DEFAULT_COLORS.BORDER_DEFAULT}`,
        backgroundColor: DEFAULT_COLORS.BACKGROUND_WHITE,
        color: DEFAULT_COLORS.TEXT_MUTED,
      },
    },
  },
  LIST: {
    EMPTY_STATE: {
      padding: '24px',
      textAlign: 'center' as const,
      color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
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
        background: DEFAULT_COLORS.SURFACE_WHITE,
        border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
        borderRadius: 8,
        transition: 'all 0.2s ease',
        cursor: 'pointer' as const,
        minHeight: '48px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box' as const,
      },
      HOVER: {
        background: DEFAULT_COLORS.SURFACE_HOVER,
      },
    },
    ROLE_NAME: {
      fontSize: 14,
      color: DEFAULT_COLORS.TEXT_ON_SURFACE,
      fontWeight: 500,
      lineHeight: 1.4,
    },
    ROLE_DESCRIPTION: {
      fontSize: 12,
      color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
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
      color: DEFAULT_COLORS.PILL_TEXT,
      padding: '2px 6px',
      ...getPillSurface(),
      borderRadius: 4,
      lineHeight: 1.4,
    },
  },
  TOOLTIPS: {
    PROTECTED_ROLE: 'This role is protected from deletion and modification',
  },
} as const;
