import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { SHARED_PAGE_CONSTANTS } from '../../../../../constants/shared/pages';
import { parseConsumedPercent } from './snapshotStorageUtils';

export interface SnapshotStorageBarProps {
  consumedLabel: string;
  availableLabel?: string;
  totalLabel?: string;
}

const SnapshotStorageBar: React.FC<SnapshotStorageBarProps> = memo(
  ({ consumedLabel, availableLabel, totalLabel }) => {
    const pct = parseConsumedPercent(consumedLabel);
    const widthPct = pct ?? 0;
    const barH = SHARED_PAGE_CONSTANTS.UI.PROGRESS_BAR_HEIGHT;
    const barR = SHARED_PAGE_CONSTANTS.UI.PROGRESS_BAR_BORDER_RADIUS;

    return (
      <div style={{ minWidth: 120, maxWidth: 200 }}>
        <div
          style={{
            height: barH,
            borderRadius: barR,
            background: DEFAULT_COLORS.BACKGROUND_LIGHT,
            border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${widthPct}%`,
              background: DEFAULT_COLORS.SUCCESS,
              borderRadius: barR,
              transition: 'width 0.2s ease',
            }}
          />
        </div>
        {(availableLabel || totalLabel) && (
          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              color: DEFAULT_COLORS.TEXT_MUTED,
              lineHeight: 1.3,
            }}
          >
            {availableLabel && totalLabel
              ? `${availableLabel} / ${totalLabel}`
              : availableLabel || totalLabel}
          </div>
        )}
      </div>
    );
  },
);

SnapshotStorageBar.displayName = 'SnapshotStorageBar';

export default SnapshotStorageBar;
