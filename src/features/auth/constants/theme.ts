import {
  AUTH_CONTROL_HEIGHT,
  CONTROL_RADIUS,
  CONTROL_FONT_SIZE,
  DEFAULT_COLORS,
} from '../../../constants';

const CONTROL_GEOMETRY = {
  controlHeight: AUTH_CONTROL_HEIGHT,
  borderRadius: CONTROL_RADIUS,
  fontSize: CONTROL_FONT_SIZE,
} as const;

export const LIGHT_TOKENS = {
  ...CONTROL_GEOMETRY,
  colorPrimary: DEFAULT_COLORS.SUCCESS,
  // The root provider's white colorTextBase would otherwise leak onto the auth card.
  colorTextBase: DEFAULT_COLORS.AUTH_LIGHT_TEXT,
  colorBgContainer: DEFAULT_COLORS.AUTH_LIGHT_CARD_BG,
  colorBorder: DEFAULT_COLORS.AUTH_LIGHT_BORDER,
  // Not derived from colorBorder: a disabled button would otherwise get a black or blue edge.
  colorBorderDisabled: DEFAULT_COLORS.AUTH_LIGHT_BORDER,
  colorTextPlaceholder: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
} as const;

// The root theme's labels are white and its focused fields take a darker edge: the auth card keeps
// its own text color and an unchanged border, without a focus glow.
export const LIGHT_COMPONENTS = {
  Form: { labelColor: DEFAULT_COLORS.AUTH_LIGHT_TEXT },
  Input: {
    hoverBorderColor: DEFAULT_COLORS.AUTH_LIGHT_BORDER,
    activeBorderColor: DEFAULT_COLORS.AUTH_LIGHT_BORDER,
    activeShadow: 'none',
    errorActiveShadow: 'none',
  },
} as const;
