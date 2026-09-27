import React from 'react';
import {
  CARD_LAYOUT,
  CARD_STAT_CELL_FLEX,
  DEFAULT_COLORS,
  MICRO_LABEL_STYLE,
  TRUNCATE_STYLE,
} from '../../../constants';
import type { StatCellProps } from '../../../interfaces/layout/card';

const StatCell: React.FC<StatCellProps> = ({ label, value, accent }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0,
      flex: CARD_STAT_CELL_FLEX,
    }}
  >
    <span style={{ ...MICRO_LABEL_STYLE, ...TRUNCATE_STYLE }}>{label}</span>
    <span
      style={{
        ...TRUNCATE_STYLE,
        fontSize: CARD_LAYOUT.VALUE_FONT_SIZE_PX,
        fontWeight: 600,
        color: accent ?? DEFAULT_COLORS.TEXT_PRIMARY,
        lineHeight: 1.3,
      }}
    >
      {value}
    </span>
  </div>
);

export default StatCell;
