import { DEFAULT_COLORS } from '../shared/colors';

// Detail-page sections that applications and protection plans share.
export const SECTION_LAYOUT = {
  SUBTLE_DIVIDER: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
  /** RowTag display for runtime list values (ports, env keys, snapshot field tags). */
  RUNTIME_VALUE_ROW_TAG: {
    fontSize: 11,
  },
} as const;
