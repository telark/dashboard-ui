import React from 'react';
import {
  CARD_LAYOUT,
  CARD_MORE_LABEL,
  DEFAULT_COLORS,
  LINE_HEIGHT,
  SPACING,
} from '../../../constants';
import type { CardChipSectionProps } from '../../../interfaces/layout/card';
import CardChip from './CardChip';

const MUTED_STYLE: React.CSSProperties = {
  margin: 0,
  fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_MUTED,
  lineHeight: LINE_HEIGHT.TIGHT,
};

const CardChipSection: React.FC<CardChipSectionProps> = ({ label, items, emptyText }) => {
  const shown = items.slice(0, CARD_LAYOUT.MAX_POLICY_CHIPS);
  const hidden = items.slice(CARD_LAYOUT.MAX_POLICY_CHIPS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.S6 }}>
      <span style={MUTED_STYLE}>{label}</span>
      {shown.length === 0 ? (
        <p style={MUTED_STYLE}>{emptyText}</p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: SPACING.NONE,
            display: 'flex',
            flexWrap: 'wrap',
            gap: SPACING.S6,
          }}
        >
          {shown.map((item) => (
            <CardChip
              key={item.key}
              label={item.label}
              icon={item.icon}
              accent={item.accent}
              title={item.title}
            />
          ))}
          {hidden.length > 0 && (
            <CardChip
              label={CARD_MORE_LABEL(hidden.length)}
              tooltip={hidden.map((item) => item.label).join(', ')}
            />
          )}
        </ul>
      )}
    </div>
  );
};

export default CardChipSection;
