import React from 'react';
import {
  CARD_LAYOUT,
  CARD_MORE_LABEL,
  DEFAULT_COLORS,
  DIVIDED_BLOCK_STYLE,
  MICRO_LABEL_STYLE,
} from '../../../constants';
import type { CardChipSectionProps } from '../../../interfaces/layout/card';
import CardChip from './CardChip';

const CardChipSection: React.FC<CardChipSectionProps> = ({ label, items, emptyText }) => {
  const shown = items.slice(0, CARD_LAYOUT.MAX_POLICY_CHIPS);
  const hidden = items.length - shown.length;

  return (
    <div style={DIVIDED_BLOCK_STYLE}>
      <span style={MICRO_LABEL_STYLE}>{label}</span>
      {shown.length === 0 ? (
        <p
          style={{
            margin: '10px 0 0',
            fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
            color: DEFAULT_COLORS.TEXT_MUTED,
          }}
        >
          {emptyText}
        </p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            margin: '8px 0 0',
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
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
          {hidden > 0 && (
            <li style={{ ...MICRO_LABEL_STYLE, alignSelf: 'center' }}>{CARD_MORE_LABEL(hidden)}</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CardChipSection;
