import React, { memo, useEffect, useState } from 'react';
import { App as AntdApp } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { SettingsDetails, SettingsField, SettingsHint } from '../../components/SettingsFields';
import SnapshotStorageBar from '../../../applications/components/snapshots/SnapshotStorageBar';
import type { SnapshotStorageMetric } from '../../../applications/models';
import { fetchReportStorage } from '../../../plans/protection/clients';
import type { ReportStorageInfos } from '../../../plans/protection/models';
import { INSIGHTS_GOVERNANCE_CONSTANTS as C } from './constants';
import {
  ACTION_PERMISSIONS,
  usePermission,
} from '../../../auth/hooks/permissions/permissionEngine';

const VIEW_REPORTS_PERMISSION = ACTION_PERMISSIONS.protectionPlans.viewReports;

const metricLine = (metric: SnapshotStorageMetric) =>
  `${metric.mb.toFixed(2)} MB (${metric.percent?.toFixed(2) ?? '0.00'}%)`;

// Read-only: reports are capped per plan, so the volume has no setting of its own.
const ReportStorageSection: React.FC = memo(() => {
  const canViewReportStorage = usePermission(
    VIEW_REPORTS_PERMISSION.scope,
    VIEW_REPORTS_PERMISSION.level,
    VIEW_REPORTS_PERMISSION.deny,
  );
  const { message } = AntdApp.useApp();
  const [infos, setInfos] = useState<ReportStorageInfos | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canViewReportStorage) return;
    setLoading(true);
    fetchReportStorage()
      .then(setInfos, () => {
        setInfos(null);
        message.error(C.MESSAGES.REPORT_STORAGE_LOAD_FAILED);
      })
      .finally(() => setLoading(false));
  }, [canViewReportStorage, message]);

  return (
    <SettingsCard
      title={C.LABELS.REPORT_STORAGE_TITLE}
      description={C.LABELS.REPORT_STORAGE_DESCRIPTION}
    >
      <div
        style={{
          // Off scale, kept exact: gap 14 (MD to LG), as in Snapshot storage.
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {!canViewReportStorage ? (
          <SettingsHint>{C.LABELS.REPORT_STORAGE_NO_ACCESS}</SettingsHint>
        ) : loading ? (
          <SettingsHint>{C.LABELS.REPORT_STORAGE_LOADING}</SettingsHint>
        ) : infos ? (
          <>
            <SettingsField label={C.LABELS.SNAPSHOT_STORAGE_USAGE_LABEL}>
              <SnapshotStorageBar
                percentUsed={infos.consumedSpace.percent ?? 0}
                metricsLine={`${infos.consumedSpace.mb.toFixed(2)} MB / ${infos.totalPVCSpace.mb.toFixed(2)} MB`}
              />
            </SettingsField>
            <SettingsDetails
              items={[
                {
                  label: C.LABELS.SNAPSHOT_STORAGE_CONSUMED,
                  value: metricLine(infos.consumedSpace),
                },
                {
                  label: C.LABELS.SNAPSHOT_STORAGE_AVAILABLE,
                  value: metricLine(infos.availableSpace),
                },
                { label: C.LABELS.REPORT_STORAGE_TOTAL_REPORTS, value: infos.totalReports },
              ]}
            />
          </>
        ) : null}
      </div>
    </SettingsCard>
  );
});

ReportStorageSection.displayName = 'ReportStorageSection';

export default ReportStorageSection;
