import React, { memo, useMemo } from 'react';
import { APPLICATIONS_UI } from '../../constants';
import type { ApplicationSnapshotSummary } from '../../models';
import SnapshotStorageBar from './SnapshotStorageBar';
import {
  buildAggregateSnapshotStorage,
  formatBytesCompact,
} from './snapshotStorageUtils';

export interface SnapshotAggregateStorageBarProps {
  snapshots: ApplicationSnapshotSummary[];
}

/** Consumption summary for `SettingsCard` header (top-right, aligned with title stack). */
const SnapshotAggregateStorageBar: React.FC<SnapshotAggregateStorageBarProps> = memo(
  ({ snapshots }) => {
    const { percentUsed, metricsLine } = useMemo(() => {
      const agg = buildAggregateSnapshotStorage(snapshots);
      const sn = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;
      const usedFmt = formatBytesCompact(agg.usedBytes);
      const totalFmt =
        agg.totalBytes != null && agg.totalBytes > 0 ? formatBytesCompact(agg.totalBytes) : null;
      const usedOverTotal = totalFmt != null ? `${usedFmt} / ${totalFmt}` : usedFmt;
      const line = agg.availableLabel
        ? `${usedOverTotal}${sn.STORAGE_METRICS_JOINER}${sn.STORAGE_AVAILABLE} ${agg.availableLabel}`
        : usedOverTotal;
      return { percentUsed: agg.percentUsed, metricsLine: line };
    }, [snapshots]);

    if (snapshots.length === 0) return null;

    return (
      <div
        style={{
          textAlign: 'right',
          width: 220,
          paddingTop: 2,
          alignSelf: 'flex-start',
        }}
      >
        <SnapshotStorageBar percentUsed={percentUsed} metricsLine={metricsLine} />
      </div>
    );
  },
);

SnapshotAggregateStorageBar.displayName = 'SnapshotAggregateStorageBar';

export default SnapshotAggregateStorageBar;
