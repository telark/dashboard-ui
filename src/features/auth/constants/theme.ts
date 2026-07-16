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
  colorPrimary: '#20C997',
  colorBgContainer: '#ffffff',
  colorBorder: '#e2e8f0',
  colorTextPlaceholder: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
} as const;

export const DARK_TOKENS = {
  ...CONTROL_GEOMETRY,
  colorPrimary: '#20C997',
  colorBgContainer: '#0f172a',
  colorBorder: '#1e293b',
  colorTextPlaceholder: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
} as const;
