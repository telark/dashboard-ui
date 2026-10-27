import type React from 'react';
import {
  DEFAULT_COLORS,
  HAIRLINE,
  ROW_ICON_BUTTON_SIZE,
  MOTION,
  RADIUS,
  SPACING,
} from '../../../../../constants';

// Off scale, kept exact: padding 5 (XS to S6), padding 14 (MD to LG).
export const ASSIGNED_CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: SPACING.SM,
  padding: '5px 14px',
  background: DEFAULT_COLORS.SURFACE_WHITE,
  border: HAIRLINE.SURFACE_BORDER_LIGHT,
  borderRadius: RADIUS.MD,
  transition: `all ${MOTION.BASE_MS}ms ${MOTION.EASE}`,
  cursor: 'default',
  minHeight: '48px',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
};

export const ASSIGNED_LIST_CONTAINER_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: SPACING.SM,
  width: '100%',
  padding: SPACING.NONE,
  boxSizing: 'border-box',
  alignItems: 'stretch',
};

export const ASSIGNED_EMPTY_STATE_STYLE: React.CSSProperties = {
  padding: SPACING.XXL,
  textAlign: 'center',
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
};

// Icon-only row action: borderless, muted, square, centered on the card's first line.
export const ASSIGNED_VIEW_BUTTON_STYLE: React.CSSProperties = {
  width: ROW_ICON_BUTTON_SIZE,
  height: ROW_ICON_BUTTON_SIZE,
  flexShrink: 0,
  marginTop: SPACING.XS,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
};
