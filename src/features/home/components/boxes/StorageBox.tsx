import React, { memo } from 'react';
import SnapshotStorageBar from '../../../applications/components/snapshots/SnapshotStorageBar';
import { HOME_DASHBOARD_TEXTS as T } from '../../constants/dashboard';
import type { BoxState, SnapshotStorageState } from '../../models';
import SummaryBox from './SummaryBox';

const S = T.STORAGE;

const StorageBox: React.FC<{ storage: SnapshotStorageState } & Pick<BoxState, 'noAccess'>> = memo(
  ({ storage: { infos, failed }, noAccess }) => {
    const percent = infos?.consumedSpace.percent ?? 0;
    return (
      <SummaryBox
        title={S.TITLE}
        loading={!infos && !failed}
        failed={failed}
        noAccess={noAccess}
        value={`${percent.toFixed(1)}%`}
        caption={S.USED}
      >
        {infos ? (
          <SnapshotStorageBar
            percentUsed={percent}
            metricsLine={`${infos.consumedSpace.mb.toFixed(2)} ${S.MB} ${S.OF} ${infos.totalPVCSpace.mb.toFixed(2)} ${S.MB} · ${infos.totalSnapshots} ${S.SNAPSHOTS}`}
          />
        ) : null}
      </SummaryBox>
    );
  },
);

StorageBox.displayName = 'StorageBox';

export default StorageBox;
