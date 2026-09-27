import React from 'react';
import { CARD_LAYOUT, DEFAULT_COLORS, TRUNCATE_STYLE, getPillSurface } from '../../../constants';
import type { CardChipProps } from '../../../interfaces/layout/card';

const CardChip: React.FC<CardChipProps> = ({ label, icon, accent, title }) => (
  <li
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      minWidth: 0,
      ...getPillSurface(accent),
      color: DEFAULT_COLORS.PILL_TEXT,
      borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
      padding: '3px 9px 3px 5px',
    }}
  >
    <span
      aria-hidden
      style={{
        width: CARD_LAYOUT.AVATAR_CHIP_SIZE_PX,
        height: CARD_LAYOUT.AVATAR_CHIP_SIZE_PX,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        flexShrink: 0,
      }}
    >
      {icon}
    </span>
    <span
      title={title ?? label}
      style={{
        ...TRUNCATE_STYLE,
        fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
        lineHeight: 1.4,
      }}
    >
      {label}
    </span>
  </li>
);

export default CardChip;
