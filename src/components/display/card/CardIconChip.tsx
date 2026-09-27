import React from 'react';
import { CARD_LAYOUT, getAccentTint } from '../../../constants';
import type { CardIconChipProps } from '../../../interfaces/layout/card';

const CardIconChip: React.FC<CardIconChipProps> = ({ icon, accent }) => (
  <span
    aria-hidden
    style={{
      width: CARD_LAYOUT.ICON_CHIP_SIZE_PX,
      height: CARD_LAYOUT.ICON_CHIP_SIZE_PX,
      borderRadius: CARD_LAYOUT.ICON_CHIP_RADIUS_PX,
      background: getAccentTint(accent),
      color: accent,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      flexShrink: 0,
    }}
  >
    {icon}
  </span>
);

export default CardIconChip;
