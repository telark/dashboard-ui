import { DEFAULT_COLORS } from '../shared/colors';

// Detail-page sections that applications and protection plans share. SUBTLE_DIVIDER is also the
// dark page's 1px border (cards, boxes, dividers).
export const SECTION_LAYOUT = {
  SUBTLE_DIVIDER: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
} as const;

// The other 1px borders, named by their color token.
export const HAIRLINE = {
  SURFACE_BORDER_LIGHT: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
  SURFACE_BORDER: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
  BORDER_SUBTLE: `1px solid ${DEFAULT_COLORS.BORDER_SUBTLE}`,
} as const;
