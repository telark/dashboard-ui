import type { CSSProperties } from 'react';
import { DEFAULT_COLORS } from '../shared/colors';
import { CONTROL_HEIGHT } from './controls';

/** Entity cards (protection plans, applications): the elevated panel geometry every block inside it measures from. */
export const CARD_LAYOUT = {
  CARDS_PER_ROW: 3,
  GRID_GAP_PX: 12,
  PADDING_PX: 14,
  RADIUS_PX: 8,
  BLOCK_GAP_PX: 12,
  ICON_CHIP_RADIUS_PX: 8,
  AVATAR_CHIP_SIZE_PX: 16,
  TITLE_FONT_SIZE_PX: 14,
  // Narrower, the header pills wrap under the title. Two pills and the menu take up to 238px of a
  // 318px desktop card header (measured), so they stay in the corner and long names truncate.
  TITLE_MIN_WIDTH_PX: 64,
  META_FONT_SIZE_PX: 11,
  // Centers the corner (pills, health, 30px menu) on the 18px name line: (30 - 18) / 2.
  CORNER_OFFSET_PX: -6,
  // Height of one row of tags, reserved while their names are still loading.
  TAG_ROW_MIN_HEIGHT_PX: 20,
  MAX_TARGET_TAGS: 3,
  VALUE_FONT_SIZE_PX: 12,
  TRACK_HEIGHT_PX: 4,
  MAX_POLICY_CHIPS: 3,
  PILL_RADIUS_PX: 999,
} as const;

// Keeps three cards across a 1440px window with the sidebar open (a 1069px grid).
export const CARD_MIN_WIDTH_PX = 338;

// A disabled selectable card dims what it holds, never the line that says why it is disabled.
export const DISABLED_CONTENT_OPACITY = 0.55;

/** Columns for a card grid measured at `width`; 0 means not measured yet. */
export const getCardGridColumns = (width: number): number => {
  if (width <= 0) return CARD_LAYOUT.CARDS_PER_ROW;
  const fit = Math.floor(
    (width + CARD_LAYOUT.GRID_GAP_PX) / (CARD_MIN_WIDTH_PX + CARD_LAYOUT.GRID_GAP_PX),
  );
  return Math.min(Math.max(fit, 1), CARD_LAYOUT.CARDS_PER_ROW);
};

export const CARD_MORE_LABEL = (count: number): string => `+${count}`;

// The words both entity cards use: the menu's name and the footer's time prefixes.
export const CARD_TEXTS = {
  ACTIONS_LABEL: (name: string) => `Actions for ${name}`,
  UPDATED_PREFIX: 'Updated',
  CREATED_PREFIX: 'Created',
} as const;

export const TRUNCATE_STYLE: CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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

export const getCardShellStyle = (hovered: boolean): CSSProperties => ({
  position: 'relative',
  background: hovered ? DEFAULT_COLORS.SURFACE_ELEVATED_HOVER : DEFAULT_COLORS.SURFACE_ELEVATED,
  borderRadius: CARD_LAYOUT.RADIUS_PX,
  // The fill is barely lighter than the page, so the border carries the card's edge.
  border: `1px solid ${hovered ? DEFAULT_COLORS.BORDER_HOVER : DEFAULT_COLORS.BORDER_DEFAULT}`,
  padding: CARD_LAYOUT.PADDING_PX,
  boxSizing: 'border-box',
  cursor: 'pointer',
  transition: 'background 140ms ease, border-color 140ms ease',
});

export const getCardMenuButtonStyle = (open: boolean): CSSProperties => ({
  color: open ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.ICON_SECONDARY,
  flexShrink: 0,
  width: CONTROL_HEIGHT,
  height: CONTROL_HEIGHT,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: CARD_LAYOUT.ICON_CHIP_RADIUS_PX,
  background: open ? DEFAULT_COLORS.HOVER_BG : 'transparent',
  transition: 'background 120ms ease, color 120ms ease',
});
