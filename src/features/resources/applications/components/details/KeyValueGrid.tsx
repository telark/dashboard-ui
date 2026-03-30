import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';

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
  const labelWidth = compact ? 'minmax(0, 140px)' : '180px';

  return (
    <div style={{ display: 'grid', rowGap }}>
      {rows.map((r) => (
        <div
          key={r.k}
          style={{ display: 'grid', gridTemplateColumns: `${labelWidth} minmax(0, 1fr)`, gap: 12 }}
        >
          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700 }}>
            {r.label}
          </div>
          <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontSize: 13, minWidth: 0 }}>
            {r.value}
          </div>
        </div>
      ))}
    </div>
  );
});

KeyValueGrid.displayName = 'KeyValueGrid';

export default KeyValueGrid;

