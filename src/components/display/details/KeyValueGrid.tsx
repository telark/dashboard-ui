import React, { memo } from 'react';
import { DEFAULT_COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../../constants';

export interface KeyValueGridRow {
  k: string;
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface KeyValueGridProps {
  rows: KeyValueGridRow[];
  compact?: boolean;
  /** Regular-weight labels, so the values carry the weight. */
  plainLabels?: boolean;
}

const KeyValueGrid: React.FC<KeyValueGridProps> = memo(
  ({ rows, compact = false, plainLabels = false }) => {
    // 10: the roomy row gap sits between SM and MD.
    const rowGap = compact ? SPACING.S6 : 10;
    const rowStyle: React.CSSProperties = compact
      ? { display: 'grid', gridTemplateColumns: 'minmax(0, 140px) minmax(0, 1fr)', gap: SPACING.MD }
      : // A value narrower than 120px would wrap word by word: it drops under its label instead.
        { display: 'flex', flexWrap: 'wrap', columnGap: SPACING.MD, rowGap: SPACING.XXS };

    return (
      <div style={{ display: 'grid', rowGap }}>
        {rows.map((r) => (
          // minWidth 0: a long unbreakable value ellipsizes in its column, never widens it.
          <div key={r.k} style={{ ...rowStyle, minWidth: 0 }}>
            {/* The flex sizes apply to the wrapping rows only; a grid row ignores them. */}
            <div
              style={{
                flex: '0 1 180px',
                color: DEFAULT_COLORS.TEXT_MUTED,
                fontSize: FONT_SIZE.SM,
                fontWeight: plainLabels ? FONT_WEIGHT.REGULAR : FONT_WEIGHT.BOLD,
              }}
            >
              {r.label}
            </div>
            <div
              style={{
                flex: '1 1 120px',
                color: DEFAULT_COLORS.TEXT_PRIMARY,
                fontSize: FONT_SIZE.MD,
                minWidth: 0,
              }}
            >
              {r.value}
            </div>
          </div>
        ))}
      </div>
    );
  },
);

KeyValueGrid.displayName = 'KeyValueGrid';

export default KeyValueGrid;
