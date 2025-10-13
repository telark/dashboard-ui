import { DEFAULT_COLORS } from '../colors';
import { CARD_CONFIGS, CARD_COLORS, CARD_TRANSITIONS, CARD_EFFECTS, CARD_STATES } from '../cards';

// GrouperCard specific styles for better performance and modularity
export const GROUPER_CARD_STYLES = {
  // Main card container
  card: {
    width: '100%',
    borderRadius: CARD_CONFIGS.GROUPER_CARD.BORDER_RADIUS,
    boxShadow: CARD_COLORS.SHADOW.CARD,
    border: 'none',
    position: 'relative' as const,
    background: CARD_COLORS.BACKGROUND.DEFAULT,
    transition: CARD_TRANSITIONS.CARD,
  },
  
  // Card body
  cardBody: {
    padding: CARD_CONFIGS.GROUPER_CARD.BODY_PADDING,
  },

  // Top-right icons container
  topIconsContainer: {
    position: 'absolute' as const,
    top: CARD_CONFIGS.GROUPER_CARD.POSITION.TOP,
    right: CARD_CONFIGS.GROUPER_CARD.POSITION.RIGHT,
    display: 'flex',
    alignItems: 'center',
    gap: CARD_CONFIGS.GROUPER_CARD.TOP_ICONS_GAP,
    zIndex: 2,
  },

  // Maintenance badge
  maintenanceBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.GAP,
    backgroundColor: CARD_COLORS.BACKGROUND.MAINTENANCE_BADGE,
    color: CARD_COLORS.TEXT.MAINTENANCE,
    padding: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.PADDING,
    borderRadius: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.BORDER_RADIUS,
    fontSize: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.FONT_SIZE,
    fontWeight: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.FONT_WEIGHT,
  },

  // Info icon
  infoIcon: {
    fontSize: CARD_CONFIGS.GROUPER_CARD.ICON_FONT_SIZE,
    color: CARD_COLORS.TEXT.INFO,
    cursor: 'pointer',
  },

  // Main content container
  mainContent: {
    marginTop: '4px',
  },

  // Header section
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: CARD_CONFIGS.GROUPER_CARD.HEADER_GAP,
    marginBottom: CARD_CONFIGS.GROUPER_CARD.HEADER_MARGIN_BOTTOM,
  },

  // Icon container
  iconContainer: {
    backgroundColor: CARD_COLORS.ICON.BACKGROUND,
    padding: '10px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: CARD_COLORS.ICON.SHADOW,
  },

  // Icon span
  iconSpan: {
    display: 'inline-flex',
    fontSize: '18px',
    color: DEFAULT_COLORS.SUCCESS,
  },

  // Title
  title: {
    margin: 0,
    fontSize: CARD_CONFIGS.GROUPER_CARD.TITLE_FONT_SIZE,
    fontWeight: '600',
  },

  // Description text
  description: {
    color: DEFAULT_COLORS.DEFAULT,
    fontSize: CARD_CONFIGS.GROUPER_CARD.DESCRIPTION_FONT_SIZE,
  },

  // Metrics container
  metricsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: CARD_CONFIGS.GROUPER_CARD.METRICS_PADDING_TOP,
    gap: CARD_CONFIGS.GROUPER_CARD.METRICS_GAP,
  },

  // Action icons
  actionIcon: {
    fontSize: CARD_CONFIGS.GROUPER_CARD.ICON_FONT_SIZE,
    cursor: 'pointer',
    transition: CARD_TRANSITIONS.ICON,
  },

  // Sync icon container
  syncIconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: CARD_CONFIGS.GROUPER_CARD.ICON_SIZE,
    height: CARD_CONFIGS.GROUPER_CARD.ICON_SIZE,
    cursor: 'pointer',
  },

  // Delete icon
  deleteIcon: {
    fontSize: CARD_CONFIGS.GROUPER_CARD.ICON_FONT_SIZE,
    cursor: 'pointer',
    color: DEFAULT_COLORS.DANGER,
    transition: CARD_TRANSITIONS.ICON,
  },
} as const;

// Icon hover effects
export const ICON_HOVER_EFFECTS = {
  onMouseOver: (e: React.MouseEvent<HTMLElement>, statusColor: string) => {
    (e.currentTarget as HTMLElement).style.color = statusColor;
    (e.currentTarget as HTMLElement).style.transform = CARD_EFFECTS.ICON_SCALE;
  },
  
  onMouseOut: (e: React.MouseEvent<HTMLElement>, defaultColor?: string) => {
    (e.currentTarget as HTMLElement).style.color = defaultColor || '';
    (e.currentTarget as HTMLElement).style.transform = CARD_EFFECTS.ICON_SCALE_NORMAL;
  },
} as const;

// Status style configuration
export const getStatusStyle = (status: string) => {
  return status === CARD_STATES.STATUS.ACTIVE
    ? {
        color: DEFAULT_COLORS.SUCCESS,
        borderColor: DEFAULT_COLORS.SUCCESS,
      }
    : {
        color: DEFAULT_COLORS.DEFAULT,
        borderColor: DEFAULT_COLORS.DEFAULT,
      };
};

// Action icon configurations
export const ACTION_ICON_CONFIGS = {
  view: {
    icon: 'EyeOutlined',
    popover: 'View Details',
  },
  sync: {
    icon: 'SyncOutlined',
    popover: 'Sync Grouper',
  },
  delete: {
    icon: 'DeleteOutlined',
    popover: 'Delete Grouper',
  },
} as const;

// Sync-related constants
export const SYNC_CONSTANTS = {
  // Message key prefix
  MESSAGE_KEY_PREFIX: 'sync-',
  
  // Polling configuration
  POLLING: {
    INTERVAL_MS: 250,
    MAX_WAIT_MS: 4000,
  },
  
  // Message durations
  MESSAGE_DURATIONS: {
    LOADING: 0,
    SUCCESS: 2,
    ERROR: 3,
  },
  
  // Default sync effect
  DEFAULT_SYNC_EFFECT: 'NoUpdate',
  
  // Effects that trigger polling
  POLLING_EFFECTS: ['Deleted', 'NotFound'] as const,
  
  // Error key
  ERROR_KEY: 'sync-error',
} as const;

// FancySpinner configuration
export const FANCY_SPINNER_CONFIG = {
  SHOW_LABEL: false,
  SIZE: 22,
  RING_THICKNESS: 2,
} as const;

// Maintenance badge icon
export const MAINTENANCE_BADGE_ICON = {
  FONT_SIZE: '16px',
} as const;
