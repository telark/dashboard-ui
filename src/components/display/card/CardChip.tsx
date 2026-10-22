import React from 'react';
import { Tooltip } from 'antd';
import { CARD_LAYOUT, TRUNCATE_STYLE, getPillSurface, SPACING } from '../../../constants';
import type { CardChipProps } from '../../../interfaces/layout/card';

const CardChip: React.FC<CardChipProps> = ({ label, icon, accent, title, tooltip }) => {
  const chip = (
    <li
      style={{
        // Off scale, kept exact: padding 3 (XXS to XS), padding 9 (SM to MD), padding 5 (XS to S6).
        display: 'inline-flex',
        alignItems: 'center',
        gap: SPACING.S6,
        minWidth: 0,
        ...getPillSurface(accent),
        borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
        padding: icon ? '3px 9px 3px 5px' : '3px 9px',
      }}
    >
      {icon && (
        <span
          aria-hidden
          style={{
            // Off scale, kept exact: fontSize 9 (below XXS).
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
      )}
      <span
        title={tooltip ? undefined : (title ?? label)}
        style={{
          // Off scale, kept exact: lineHeight 1.4 (SNUG to BASE).
          ...TRUNCATE_STYLE,
          fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
    </li>
  );
  return tooltip ? <Tooltip title={tooltip}>{chip}</Tooltip> : chip;
};

export default CardChip;
