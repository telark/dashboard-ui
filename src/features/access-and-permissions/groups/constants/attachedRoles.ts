import {
  DEFAULT_COLORS,
  DISABLED_CONTENT_OPACITY,
  getPillSurface,
  HAIRLINE,
} from '../../../../constants';

export const ATTACHED_ROLES_CONSTANTS = {
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
        border: HAIRLINE.SURFACE_BORDER_LIGHT,
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
      // The content dims (DIMMED), not the card, so the reason on it stays readable.
      DISABLED: {
        cursor: 'not-allowed' as const,
      },
      DIMMED: { opacity: DISABLED_CONTENT_OPACITY },
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
    ROLE_NAME_ROW: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    ROLE_SOURCE: {
      display: 'block',
      marginTop: 6,
      textAlign: 'right' as const,
      fontSize: 12,
      lineHeight: 1.3,
      color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    },
    ROLE_SCOPES: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 6,
      marginTop: 4,
    },
    SCOPE_ITEM: {
      fontSize: 11,
      padding: '2px 6px',
      ...getPillSurface(),
      borderRadius: 4,
      lineHeight: 1.4,
    },
  },
  // Measured: the role search placeholder plus the input's padding; narrower rows wrap the buttons below.
  SEARCH_MIN_WIDTH: 276,
  LABELS: {
    FROM_GROUPS: (groupNames: string) => `Via ${groupNames}`,
    LOCKED_ROLE: 'Locked role',
    // On a role card the user can't pick; the full sentence stays on the remove button.
    EXCEEDS_OWN_ACCESS: 'Grants more access than you have',
  },
  TOOLTIPS: {
    PROTECTED_ROLE: 'This role is protected from deletion and modification',
    EXCEEDS_OWN_ACCESS:
      'This role grants more access than you have, so you cannot assign or remove it',
    GROUP_EXCEEDS_OWN_ACCESS:
      'This group carries a role with more access than you have, so you cannot add or remove it',
    MEMBERS_EXCEED_OWN_ACCESS:
      'This group carries a role with more access than you have, so you cannot change its members',
  },
} as const;
