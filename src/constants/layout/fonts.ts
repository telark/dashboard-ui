import { CONTROL_FONT_SIZE } from './controls';

// index.css forces this stack on #root; CSS can't import it, so keep the two equal.
export const FONT_FAMILY = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Inside #root the global Geist !important rule beats inline fontFamily; this class gets past it.
export const MONOSPACE_CLASS = 'manifest-code';

// Type scale for inline styles. A value off the scale stays literal with a one-line reason.
export const FONT_SIZE = {
  XXS: 10,
  XS: 11,
  SM: 12,
  MD: 13,
  BASE: CONTROL_FONT_SIZE,
  LG: 16,
  XL: 18,
  XXL: 20,
  H2: 24,
  H1: 28,
} as const;

export const FONT_WEIGHT = {
  REGULAR: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
} as const;

export const LINE_HEIGHT = {
  NONE: 1,
  TIGHT: 1.2,
  SNUG: 1.35,
  BASE: 1.5,
  LOOSE: 1.6,
} as const;
