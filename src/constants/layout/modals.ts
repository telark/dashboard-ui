import { BUTTON_CONFIGS } from './buttons';
import { CONTROL_HEIGHT } from './controls';
import { DEFAULT_COLORS, getPillSurface } from '../shared/colors';

export const ACTION_CONFIRM_MODAL = {
  MODAL: {
    WIDTH: 360,
    BORDER_RADIUS: 12,
    CLASS_NAME: 'action-confirm-modal',
    /** Above SLIDE_OUT.PANEL (1001) so a confirm raised from a panel is not buried. */
    Z_INDEX: 1100,
  },
  CLOSE_ICON: {
    SIZE: 20,
    ICON_SIZE: 10,
    BACKGROUND: DEFAULT_COLORS.ICON_SECONDARY,
    COLOR: DEFAULT_COLORS.PILL_TEXT,
    BORDER_RADIUS: '50%',
    POSITION: {
      TOP: 8,
      RIGHT: 8,
    },
  },
  CONTENT: {
    GAP: 6,
    PADDING: '16px 20px 8px',
  },
  TITLE: {
    FONT_SIZE: 18,
    FONT_WEIGHT: 700,
    COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE,
    MARGIN_TOP: 0,
  },
  MESSAGE: {
    FONT_SIZE: 14,
    LINE_HEIGHT: 1.6,
    COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    MARGIN_TOP: -7,
    RESOURCE_NAME_COLOR: DEFAULT_COLORS.TEXT_ON_SURFACE,
    RESOURCE_NAME_FONT_WEIGHT: 700,
  },
  NOTE: {
    FONT_SIZE: 13,
    LINE_HEIGHT: 1.5,
    COLOR: getPillSurface(DEFAULT_COLORS.WARNING).background,
  },
  BUTTONS: {
    GAP: 12,
    MARGIN_TOP: 10,
    MARGIN_BOTTOM: -12,
    CONFIRM: {
      BORDER_RADIUS: 6,
      FONT_WEIGHT: BUTTON_CONFIGS.PRIMARY_BUTTON.FONT_WEIGHT,
      HEIGHT: CONTROL_HEIGHT,
      PADDING: '0 16px',
    },
  },
} as const;
