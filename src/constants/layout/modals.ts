import { BUTTON_CONFIGS } from './buttons';
import { CONTROL_RADIUS } from './controls';
import { DEFAULT_COLORS, withAlpha } from '../shared/colors';

// The one dialog chrome: BaseModal renders it, and every modal builds on BaseModal.
export const MODAL_CHROME = {
  FRAME: {
    WIDTH: 360,
    WIDE_WIDTH: 460,
    BORDER_RADIUS: 12,
    PADDING: '16px 20px',
    CLASS_NAME: 'app-modal',
    /** Above SLIDE_OUT.PANEL (1001) so a modal raised from a panel is not buried. */
    Z_INDEX: 1100,
  },
  CLOSE: {
    top: 8,
    insetInlineEnd: 8,
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  CONTENT: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  TITLE: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
    // Keeps a long title clear of the close button.
    paddingRight: 24,
  },
  MESSAGE: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.5,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  },
  RESOURCE_NAME: {
    fontWeight: 600,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
  },
  HINT: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.5,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  },
  NOTE: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '6px 10px',
    borderRadius: 8,
    border: `1px solid ${withAlpha(DEFAULT_COLORS.WARNING, 0.35)}`,
    background: DEFAULT_COLORS.WARNING_TINT,
    fontSize: 13,
    lineHeight: 1.5,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
  },
  // A read-only value to copy, such as a link.
  FIELD: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '6px 10px',
    borderRadius: CONTROL_RADIUS,
    border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
    background: DEFAULT_COLORS.SURFACE_SUBTLE,
    fontSize: 13,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'all',
  },
  ACTIONS: {
    ROW: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
    },
    PRIMARY: {
      fontWeight: BUTTON_CONFIGS.PRIMARY_BUTTON.FONT_WEIGHT,
    },
  },
} as const;
