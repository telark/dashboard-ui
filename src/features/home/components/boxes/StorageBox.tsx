import React, { memo } from 'react';
import SnapshotStorageBar from '../../../applications/components/snapshots/SnapshotStorageBar';
import type { SnapshotStorageInfos } from '../../../applications/models';
import type { ReportStorageInfos } from '../../../plans/protection/models';
import { DEFAULT_COLORS, FONT_WEIGHT, SPACING } from '../../../../constants';
import {
  HOME_BOX_ICONS,
  HOME_DASHBOARD_LAYOUT as L,
  HOME_DASHBOARD_STYLES as ST,
  HOME_DASHBOARD_TEXTS as T,
} from '../../constants/dashboard';
import type { NoAccess, StorageState } from '../../models';
import DashboardBox from '../box/DashboardBox';

const S = T.STORAGE;

const LABEL_STYLE: React.CSSProperties = {
  fontSize: L.ROW_TITLE_FONT_SIZE_PX,
  fontWeight: FONT_WEIGHT.MEDIUM,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
};

// One decimal at most: 421.9, 512, 0.
const mb = (value: number) => Number(value.toFixed(1));

type Usage = Pick<SnapshotStorageInfos, 'consumedSpace' | 'totalPVCSpace'>;

interface MeterProps {
  label: string;
  infos: Usage | null;
  count: string;
  noAccess: boolean;
}

// Name, amounts and percent on one line over a full-width bar, so the box stays as short as its row.
// A meter the viewer can't read, or that failed while the other loaded, says so on that line.
const StorageMeter: React.FC<MeterProps> = ({ label, infos, count, noAccess }) => {
  const percent = infos?.consumedSpace.percent ?? 0;
  const amounts = infos
    ? `${mb(infos.consumedSpace.mb)} / ${mb(infos.totalPVCSpace.mb)} ${S.MB}${T.META_SEPARATOR}${count}`
    : noAccess
      ? S.NO_ACCESS
      : T.LOAD_FAILED;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.XS }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: SPACING.SM }}>
        <span style={{ ...LABEL_STYLE, flexShrink: 0 }}>{label}</span>
        <span title={amounts} style={{ ...ST.MUTED_TEXT, ...ST.ELLIPSIS, flex: 1, minWidth: 0 }}>
          {amounts}
        </span>
        {infos ? (
          <span
            style={{
              ...LABEL_STYLE,
              flexShrink: 0,
              fontWeight: FONT_WEIGHT.SEMIBOLD,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {`${percent.toFixed(1)}%`}
          </span>
        ) : null}
      </div>
      {infos ? <SnapshotStorageBar percentUsed={percent} /> : null}
    </div>
  );
};

interface StorageBoxProps {
  snapshots: StorageState<SnapshotStorageInfos>;
  reports: StorageState<ReportStorageInfos>;
  snapshotsNoAccess?: NoAccess;
  reportsNoAccess?: NoAccess;
}

const pending = (state: StorageState<unknown>, noAccess?: NoAccess) =>
  !noAccess && !state.infos && !state.failed;
const unavailable = (state: StorageState<unknown>, noAccess?: NoAccess) =>
  Boolean(noAccess) || (state.failed && !state.infos);

const StorageBox: React.FC<StorageBoxProps> = memo(
  ({ snapshots, reports, snapshotsNoAccess, reportsNoAccess }) => (
    <DashboardBox
      title={S.TITLE}
      icon={HOME_BOX_ICONS.STORAGE}
      noAccess={snapshotsNoAccess && reportsNoAccess ? snapshotsNoAccess : undefined}
      loading={pending(snapshots, snapshotsNoAccess) || pending(reports, reportsNoAccess)}
      failed={unavailable(snapshots, snapshotsNoAccess) && unavailable(reports, reportsNoAccess)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.MD }}>
        <StorageMeter
          label={S.SNAPSHOTS}
          infos={snapshots.infos}
          count={S.SNAPSHOT_COUNT(snapshots.infos?.totalSnapshots ?? 0)}
          noAccess={Boolean(snapshotsNoAccess)}
        />
        <StorageMeter
          label={S.REPORTS}
          infos={reports.infos}
          count={S.REPORT_COUNT(reports.infos?.totalReports ?? 0)}
          noAccess={Boolean(reportsNoAccess)}
        />
      </div>
    </DashboardBox>
  ),
);

StorageBox.displayName = 'StorageBox';

export default StorageBox;
