import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';

export interface KeyValueGridRow {
  k: string;
  label: string;
  value: React.ReactNode;
}

export interface KeyValueGridProps {
  rows: KeyValueGridRow[];
  compact?: boolean;
}

const KeyValueGrid: React.FC<KeyValueGridProps> = memo(({ rows, compact = false }) => {
  const rowGap = compact ? 6 : 10;
  const rowStyle: React.CSSProperties = compact
    ? { display: 'grid', gridTemplateColumns: 'minmax(0, 140px) minmax(0, 1fr)', gap: 12 }
    : // A value narrower than 120px would wrap word by word: it drops under its label instead.
      { display: 'flex', flexWrap: 'wrap', columnGap: 12, rowGap: 2 };

  return (
    <div style={{ display: 'grid', rowGap }}>
      {rows.map((r) => (
        <div key={r.k} style={rowStyle}>
          {/* The flex sizes apply to the wrapping rows only; a grid row ignores them. */}
          <div
            style={{
              flex: '0 1 180px',
              color: DEFAULT_COLORS.TEXT_MUTED,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {r.label}
          </div>
          <div
            style={{
              flex: '1 1 120px',
              color: DEFAULT_COLORS.TEXT_PRIMARY,
              fontSize: 13,
              minWidth: 0,
            }}
          >
            {r.value}
          </div>
        </div>
      ))}
    </div>
  );
});

KeyValueGrid.displayName = 'KeyValueGrid';

export default KeyValueGrid;
