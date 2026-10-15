import type { CSSProperties } from 'react';
import { DEFAULT_COLORS } from '../shared/colors';

/** Entity cards (protection plans, applications): the elevated panel geometry every block inside it measures from. */
export const CARD_LAYOUT = {
  CARDS_PER_ROW: 3,
  GRID_GAP_PX: 12,
  PADDING_PX: 14,
  RADIUS_PX: 8,
  BLOCK_GAP_PX: 12,
  DIVIDER_GAP_PX: 10,
  ICON_CHIP_RADIUS_PX: 8,
  AVATAR_CHIP_SIZE_PX: 16,
  TITLE_FONT_SIZE_PX: 14,
  // Narrower, the header pills wrap under the title rather than cut the name. With the widest
  // pill row (~151px, "Pending approval") it still fits a CARD_MIN_WIDTH_PX card: only phones wrap.
  TITLE_MIN_WIDTH_PX: 140,
  META_FONT_SIZE_PX: 11,
  // Height of one row of tags, reserved while their names are still loading.
  TAG_ROW_MIN_HEIGHT_PX: 20,
  MAX_TARGET_TAGS: 3,
  MICRO_FONT_SIZE_PX: 11,
  MICRO_TRACKING: '0.06em',
  VALUE_FONT_SIZE_PX: 12,
  MONO_FONT_SIZE_PX: 10,
  TRACK_HEIGHT_PX: 4,
  CHIPS_GAP_PX: 12,
  MAX_POLICY_CHIPS: 3,
  PILL_RADIUS_PX: 999,
  // Widest stat label ("MANAGED BY", 11px/700 Geist + tracking) is ~79.4px.
  STAT_MIN_WIDTH_PX: 80,
  STATS_PER_ROW: 4,
} as const;

const STATS_ROW_MIN_WIDTH_PX =
  CARD_LAYOUT.STATS_PER_ROW * CARD_LAYOUT.STAT_MIN_WIDTH_PX +
  (CARD_LAYOUT.STATS_PER_ROW - 1) * CARD_LAYOUT.CHIPS_GAP_PX;

// Keeps three cards across a 1440px window with the sidebar open (a 1069px grid). A card
// narrower than its four stats need shows them two across (CARD_STAT_CELL_FLEX), never truncated.
export const CARD_MIN_WIDTH_PX = 338;

/** Columns for a card grid measured at `width`; 0 means not measured yet. */
export const getCardGridColumns = (width: number): number => {
  if (width <= 0) return CARD_LAYOUT.CARDS_PER_ROW;
  const fit = Math.floor(
    (width + CARD_LAYOUT.GRID_GAP_PX) / (CARD_MIN_WIDTH_PX + CARD_LAYOUT.GRID_GAP_PX),
  );
  return Math.min(Math.max(fit, 1), CARD_LAYOUT.CARDS_PER_ROW);
};

export const CARD_MORE_LABEL = (count: number): string => `+${count}`;

export const MICRO_LABEL_STYLE: CSSProperties = {
  fontSize: CARD_LAYOUT.MICRO_FONT_SIZE_PX,
  fontWeight: 700,
  letterSpacing: CARD_LAYOUT.MICRO_TRACKING,
  textTransform: 'uppercase',
  color: DEFAULT_COLORS.TEXT_MUTED,
  lineHeight: 1.2,
};

export const TRUNCATE_STYLE: CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const DIVIDED_BLOCK_STYLE: CSSProperties = {
  marginTop: CARD_LAYOUT.BLOCK_GAP_PX,
  paddingTop: CARD_LAYOUT.DIVIDER_GAP_PX,
  borderTop: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
};

export const CARD_HEADER_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
};

export const CARD_IDENTITY_STYLE: CSSProperties = {
  display: 'flex',
  flex: `1 1 ${CARD_LAYOUT.TITLE_MIN_WIDTH_PX}px`,
  alignItems: 'flex-start',
  gap: 10,
  minWidth: 0,
};

export const CARD_TITLE_COLUMN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  minWidth: 0,
};

export const CARD_TITLE_STYLE: CSSProperties = {
  ...TRUNCATE_STYLE,
  fontSize: CARD_LAYOUT.TITLE_FONT_SIZE_PX,
  fontWeight: 600,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  lineHeight: 1.3,
};

export const CARD_TAG_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 4,
  minWidth: 0,
  maxWidth: '100%',
};

export const CARD_ASIDE_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  flexShrink: 0,
  // Stays at the right edge when it wraps under the title.
  marginLeft: 'auto',
};

export const CARD_STATS_GRID_STYLE: CSSProperties = {
  ...DIVIDED_BLOCK_STYLE,
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: CARD_LAYOUT.CHIPS_GAP_PX,
  rowGap: CARD_LAYOUT.DIVIDER_GAP_PX,
};

// Four across while the row fits, otherwise two: the middle term flips from
// negative to huge at the threshold, so clamp picks the quarter or the half.
export const CARD_STAT_CELL_FLEX = `1 1 clamp(calc(25% - ${CARD_LAYOUT.CHIPS_GAP_PX}px), calc((${STATS_ROW_MIN_WIDTH_PX}px - 100%) * 999), calc(50% - ${CARD_LAYOUT.CHIPS_GAP_PX}px))`;

export const CARD_FOOTER_STYLE: CSSProperties = {
  ...DIVIDED_BLOCK_STYLE,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: 12,
  rowGap: 4,
  fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

export const getCardShellStyle = (hovered: boolean): CSSProperties => ({
  position: 'relative',
  background: hovered ? DEFAULT_COLORS.SURFACE_ELEVATED_HOVER : DEFAULT_COLORS.SURFACE_ELEVATED,
  borderRadius: CARD_LAYOUT.RADIUS_PX,
  border: `1px solid ${hovered ? DEFAULT_COLORS.BORDER_HOVER : DEFAULT_COLORS.BORDER_ELEVATED}`,
  padding: CARD_LAYOUT.PADDING_PX,
  boxSizing: 'border-box',
  cursor: 'pointer',
  transition: 'background 140ms ease, border-color 140ms ease',
});

export const getCardMenuButtonStyle = (open: boolean): CSSProperties => ({
  color: open ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.ICON_SECONDARY,
  flexShrink: 0,
  width: 30,
  height: 30,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: CARD_LAYOUT.ICON_CHIP_RADIUS_PX,
  background: open ? DEFAULT_COLORS.HOVER_BG : 'transparent',
  transition: 'background 120ms ease, color 120ms ease',
});
