export const GROUPER_CARD_TEXTS = {
  DELETE: {
    TITLE: 'Delete Grouper',
    MESSAGE: 'Are you sure you want to delete this grouper? This action cannot be undone.',
  },
  BUTTONS: {
    CONFIRM: 'Confirm',
    CANCEL: 'Cancel',
  },
  POPOVER: {
    VIEW: 'View Details',
    SYNC: 'Sync Grouper',
    DELETE: 'Delete Grouper',
    INFO: 'Grouper Information',
  },
  MAINTENANCE_BADGE: 'Maintenance Mode',
  LAST_UPDATE_PREFIX: 'Last updated',
  METRICS: {
    WORKLOADS: 'Workloads',
    BRIDGES: 'Bridges',
  },
  SYNC: {
    LOADING: 'Syncing',
    TIMEOUT_MESSAGE: 'Taking a bit longer than usual. Please try again in a moment.',
    SUCCESS_DELETE: 'Grouper deleted successfully.',
  },
} as const;

export const CARD_CONFIGS = {
  ACTION_CARD: {
    PADDING: '12px 16px',
    BORDER_RADIUS: '16px',
    MIN_HEIGHT: 84,
    ICON_SIZE: 40,
    ICON_FONT_SIZE: '16px',
    TITLE_FONT_SIZE: '16px',
    DESCRIPTION_FONT_SIZE: '13px',
    RIGHT_ICON_SIZE: 32,
    ARROW_FONT_SIZE: 12,
    FOOTER_PADDING: '4px 10px',
    FOOTER_FONT_SIZE: 12,
    FOOTER_GAP: 6,
    FOOTER_ICON_SIZE: 12,
    GAP: {
      MAIN: '16px',
      RIGHT: 8,
      FOOTER: 6,
    },
  },
  ACTION_LIST_ITEM: {
    PADDING: '12px 8px',
    BORDER_RADIUS: 12,
    ICON_SIZE: 40,
    ICON_BORDER_RADIUS: 10,
    ICON_FONT_SIZE: 18,
    ARROW_FONT_SIZE: 12,
    GAP: 14,
  },
  GROUPER_CARD: {
    BORDER_RADIUS: '12px',
    BODY_PADDING: '22px 24px 6px',
    ICON_SIZE: 18,
    ICON_FONT_SIZE: '16px',
    TITLE_FONT_SIZE: '16px',
    DESCRIPTION_FONT_SIZE: '12px',
    METRICS_GAP: '20px',
    METRICS_PADDING_TOP: '8px',
    HEADER_GAP: '10px',
    HEADER_MARGIN_BOTTOM: '8px',
    TOP_ICONS_GAP: '10px',
    MAINTENANCE_BADGE: {
      PADDING: '4px 10px',
      BORDER_RADIUS: '50px',
      FONT_SIZE: '12px',
      FONT_WEIGHT: '600',
      ICON_FONT_SIZE: '16px',
      GAP: '6px',
    },
    POSITION: {
      TOP: '16px',
      RIGHT: '24px',
    },
  },
} as const;

export const CARD_COLORS = {
  BACKGROUND: {
    DEFAULT: '#fff',
    GRADIENT: 'linear-gradient(180deg, #FFFFFF 0%, #FBFEFF 100%)',
    MAINTENANCE_BADGE: '#fef4e5',
  },
  TEXT: {
    PRIMARY: '#0B1F33',
    SECONDARY: '#5B6B7C',
    MAINTENANCE: '#faad14',
    INFO: '#888',
    ARROW: '#9AA8B2',
  },
  BORDER: {
    DEFAULT: 'rgba(0, 0, 0, 0.06)',
  },
  ICON: {
    BACKGROUND: 'rgba(32, 201, 151, 0.12)',
    BACKGROUND_ACTIVE: 'rgba(32,201,151,0.12)',
    BACKGROUND_INACTIVE: 'rgba(32,201,151,0.08)',
    SHADOW: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
    SHADOW_EXTENDED: 'inset 0 0 0 2px rgba(32, 201, 151, 0.18), 0 6px 12px rgba(32, 201, 151, 0.08)',
  },
  SHADOW: {
    DEFAULT: '0 8px 22px rgba(0, 0, 0, 0.06)',
    HOVER: '0 12px 30px rgba(0, 0, 0, 0.10)',
    CARD: '0 8px 20px rgba(0, 0, 0, 0.06)',
  },
} as const;

export const CARD_STATES = {
  STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
  },
  MAINTENANCE: {
    ACTIVE: 'Active',
  },
} as const;

export const CARD_DEFAULTS = {
  GROUPER: {
    NAME: 'Unknown',
    STATUS: CARD_STATES.STATUS.INACTIVE,
    WORKLOADS: 0,
    BRIDGES: 0,
    LAST_UPDATE: '',
  },
} as const;

export const CARD_TRANSITIONS = {
  HOVER: 'all 180ms ease',
  CARD: 'transform 0.2s ease-in-out',
  ICON: 'color 0.3s, transform 0.3s',
} as const;

export const CARD_EFFECTS = {
  HOVER_TRANSFORM: 'translateY(-2px)',
  ICON_SCALE: 'scale(1.1)',
  ICON_SCALE_NORMAL: 'scale(1)',
  ARROW_TRANSLATE: 'translateX(1px)',
  ARROW_TRANSLATE_NORMAL: 'translateX(0)',
} as const;
