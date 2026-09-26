import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import { SHARED_PAGE_CONSTANTS } from '../../../../../constants/shared/pages';
import { parseConsumedPercent } from './snapshotStorageUtils';

export interface SnapshotStorageBarProps {
  /** When set (0–100), drives bar width; otherwise parses `consumedLabel`. */
  percentUsed?: number | null;
  consumedLabel?: string;
  /** Combined caption: used/total and available on one line. */
  metricsLine?: string;
}

const SnapshotStorageBar: React.FC<SnapshotStorageBarProps> = memo(
  ({ percentUsed, consumedLabel, metricsLine }) => {
    const parsed = consumedLabel != null ? parseConsumedPercent(consumedLabel) : null;
    const pct = percentUsed != null ? percentUsed : parsed;
    const widthPct = pct != null ? Math.min(100, Math.max(0, pct)) : 0;
    const barH = Math.max(12, SHARED_PAGE_CONSTANTS.UI.PROGRESS_BAR_HEIGHT);
    const barR = SHARED_PAGE_CONSTANTS.UI.PROGRESS_BAR_BORDER_RADIUS;
    const fill =
      widthPct >= 90
        ? DEFAULT_COLORS.DANGER
        : widthPct >= 75
          ? CONNECTIVITY_CONSTANTS.COLORS.WARNING
          : DEFAULT_COLORS.SUCCESS;

    return (
      <div style={{ width: '100%', minWidth: 120 }}>
        <div
          style={{
            height: barH,
            borderRadius: barR,
            background: DEFAULT_COLORS.PAGE_BG,
            border: `1px solid ${DEFAULT_COLORS.BORDER_SUBTLE}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${widthPct}%`,
              background: fill,
              borderRadius: barR,
              transition: 'width 0.2s ease',
            }}
          />
        </div>
        {metricsLine ? (
          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              color: DEFAULT_COLORS.TEXT_MUTED,
              lineHeight: 1.35,
            }}
          >
            {metricsLine}
          </div>
        ) : null}
      </div>
    );
  },
);

SnapshotStorageBar.displayName = 'SnapshotStorageBar';

export default SnapshotStorageBar;
