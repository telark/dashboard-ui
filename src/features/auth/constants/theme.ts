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
  colorTextPlaceholder: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
} as const;

export const DARK_TOKENS = {
  ...CONTROL_GEOMETRY,
  colorPrimary: DEFAULT_COLORS.SUCCESS,
  colorTextBase: DEFAULT_COLORS.AUTH_DARK_TEXT,
  colorBgContainer: DEFAULT_COLORS.AUTH_DARK_CARD_BG,
  colorBorder: DEFAULT_COLORS.AUTH_DARK_BORDER,
  colorTextPlaceholder: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
} as const;
