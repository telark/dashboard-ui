import React from 'react';
import { Tooltip } from 'antd';
import { CARD_LAYOUT, DEFAULT_COLORS, TRUNCATE_STYLE, SPACING } from '../../../constants';
import type { CardChipProps } from '../../../interfaces/layout/card';

// A neutral outline: only the icon carries the accent, when one is given (red is never text).
const CardChip: React.FC<CardChipProps> = ({ label, icon, accent, title, tooltip }) => {
  const chip = (
    <li
      tabIndex={tooltip ? 0 : undefined}
      aria-label={tooltip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: SPACING.S6,
        minWidth: 0,
        border: `1px solid ${DEFAULT_COLORS.BORDER_HOVER}`,
        color: DEFAULT_COLORS.TEXT_SECONDARY,
        borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
        padding: icon
          ? `${SPACING.XXS}px ${SPACING.SM}px ${SPACING.XXS}px ${SPACING.XS}px`
          : `${SPACING.XXS}px ${SPACING.SM}px`,
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
            color: accent,
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
