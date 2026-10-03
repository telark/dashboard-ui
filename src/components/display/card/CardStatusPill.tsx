import React from 'react';
import { CARD_LAYOUT, getPillSurface } from '../../../constants';
import type { CardStatusPillProps } from '../../../interfaces/layout/card';

const CardStatusPill: React.FC<CardStatusPillProps> = ({ label, accent }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
      ...getPillSurface(accent),
      padding: '3px 10px',
      fontSize: CARD_LAYOUT.MICRO_FONT_SIZE_PX,
      fontWeight: 700,
      letterSpacing: CARD_LAYOUT.MICRO_TRACKING,
      textTransform: 'uppercase',
      lineHeight: 1.6,
    }}
  >
    {label}
  </span>
);

export default CardStatusPill;
