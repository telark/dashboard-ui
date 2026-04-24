import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, InputNumber, Select, Tooltip, message } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { Client, exporterApiClient } from '../../../../api';
import { DEFAULT_COLORS, Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch } from '../../../../store';
import SnapshotStorageBar from '../../../resources/applications/components/snapshots/SnapshotStorageBar';
import { INSIGHTS_GOVERNANCE_CONSTANTS as C } from './constants';
import { usePermission } from '../../../auth/hooks/permissions/permissionEngine';

const SNAPSHOTS_MAX_PRESET = [3, 5, 10, 15, 20] as const;

type SnapshotMetric = { bytes: number; kb: number; mb: number; percent?: number };
type SnapshotInfosResponse = {
  totalPVCSpace: SnapshotMetric;
  consumedSpace: SnapshotMetric;
  availableSpace: SnapshotMetric;
  totalSnapshots: number;
};

const EMPTY_SNAPSHOT_METRIC: SnapshotMetric = { bytes: 0, kb: 0, mb: 0, percent: 0 };

function normalizeSnapshotMetric(input: unknown): SnapshotMetric {
  if (!input || typeof input !== 'object') return EMPTY_SNAPSHOT_METRIC;
  const metric = input as Partial<SnapshotMetric>;
  return {
    bytes: Number.isFinite(Number(metric.bytes)) ? Number(metric.bytes) : 0,
    kb: Number.isFinite(Number(metric.kb)) ? Number(metric.kb) : 0,
    mb: Number.isFinite(Number(metric.mb)) ? Number(metric.mb) : 0,
    percent: Number.isFinite(Number(metric.percent)) ? Number(metric.percent) : 0,
  };
}

function normalizeSnapshotInfos(input: unknown): SnapshotInfosResponse | null {
  if (!input || typeof input !== 'object') return null;
  const payload =
    'data' in (input as Record<string, unknown>) ? (input as { data?: unknown }).data : input;
  if (!payload || typeof payload !== 'object') return null;
  const raw = payload as Record<string, unknown>;
  return {
    totalPVCSpace: normalizeSnapshotMetric(raw.totalPVCSpace),
    consumedSpace: normalizeSnapshotMetric(raw.consumedSpace),
    availableSpace: normalizeSnapshotMetric(raw.availableSpace),
    totalSnapshots: Number.isFinite(Number(raw.totalSnapshots)) ? Number(raw.totalSnapshots) : 0,
  };
}

const SnapshotStorageSection: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const canEditSnapshotStorage = usePermission('settings', 'Contributor');

  const saveButtonStyle = useCallback(
    (disabled: boolean): React.CSSProperties => ({
      background: DEFAULT_COLORS.SUCCESS,
      borderColor: DEFAULT_COLORS.SUCCESS,
      color: '#fff',
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }),
    [],
  );

  const [initialSnapshots, setInitialSnapshots] = useState<{ maxPerApp: number } | null>(null);
  const [snapshotsMaxPerApp, setSnapshotsMaxPerApp] = useState<number>(5);
  const [snapshotsMaxSelection, setSnapshotsMaxSelection] = useState<string>('5');
  const [customSnapshotsMaxPerApp, setCustomSnapshotsMaxPerApp] = useState<number>(5);
  const [savingSnapshotsMax, setSavingSnapshotsMax] = useState(false);
  const [snapshotInfos, setSnapshotInfos] = useState<SnapshotInfosResponse | null>(null);
  const [snapshotInfosLoading, setSnapshotInfosLoading] = useState(false);

  useEffect(() => {
    if (!globalConfig?.data) return;
    const cfg = globalConfig.data;
    const maxPerApp = Number(cfg?.snapshots?.maxPerApp ?? 5);
    const normalizedMax = Number.isFinite(maxPerApp) ? maxPerApp : 5;
    setSnapshotsMaxPerApp(normalizedMax);
    if (SNAPSHOTS_MAX_PRESET.includes(normalizedMax as (typeof SNAPSHOTS_MAX_PRESET)[number])) {
      setSnapshotsMaxSelection(String(normalizedMax));
      setCustomSnapshotsMaxPerApp(normalizedMax);
    } else {
      setSnapshotsMaxSelection('custom');
      setCustomSnapshotsMaxPerApp(normalizedMax);
    }
    setInitialSnapshots({ maxPerApp: normalizedMax });
  }, [globalConfig?.data]);

  const snapshotsHasChanges = useMemo(() => {
    if (!initialSnapshots) return false;
    return snapshotsMaxPerApp !== initialSnapshots.maxPerApp;
  }, [initialSnapshots, snapshotsMaxPerApp]);

  const loadSnapshotInfos = useCallback(async () => {
    setSnapshotInfosLoading(true);
    try {
      const { path, method } = Endpoints.SNAPSHOTS.GET_INFOS;
      const res = await Client<
        SnapshotInfosResponse | ResourceDetailsResponse<SnapshotInfosResponse>
      >(exporterApiClient, path, { method });
      setSnapshotInfos(normalizeSnapshotInfos(res));
    } catch {
      setSnapshotInfos(null);
      message.error(C.MESSAGES.SNAPSHOT_STORAGE_LOAD_FAILED);
    } finally {
      setSnapshotInfosLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnapshotInfos();
  }, [loadSnapshotInfos]);

  const saveSnapshotsMax = useCallback(async () => {
    setSavingSnapshotsMax(true);
    try {
      const maxPerApp = Math.max(1, Math.floor(snapshotsMaxPerApp));
      const { path, method } = Endpoints.GLOBALCONFIG.PATCH;
      await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path, {
        method,
        data: { snapshots: { maxPerApp } },
      });
      message.success(C.MESSAGES.PLATFORM_SAVE_SNAPSHOTS_SUCCESS);
      setInitialSnapshots({ maxPerApp });
      dispatch(fetchGlobalConfigThunk());
      void loadSnapshotInfos();
    } catch {
      message.error(C.MESSAGES.PLATFORM_SAVE_SNAPSHOTS_FAILED);
    } finally {
      setSavingSnapshotsMax(false);
    }
  }, [dispatch, loadSnapshotInfos, snapshotsMaxPerApp]);

  const consumedLine = useMemo(() => {
    if (!snapshotInfos) return null;
    return `${snapshotInfos.consumedSpace.mb.toFixed(2)} MB (${snapshotInfos.consumedSpace.percent?.toFixed(2) ?? '0.00'}%)`;
  }, [snapshotInfos]);

  const availableLine = useMemo(() => {
    if (!snapshotInfos) return null;
    return `${snapshotInfos.availableSpace.mb.toFixed(2)} MB (${snapshotInfos.availableSpace.percent?.toFixed(2) ?? '0.00'}%)`;
  }, [snapshotInfos]);

  return (
    <SettingsCard title="Snapshot Storage" description={C.LABELS.SNAPSHOT_STORAGE_DESCRIPTION}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {snapshotInfosLoading ? (
          <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
            {C.LABELS.SNAPSHOT_STORAGE_LOADING}
          </div>
        ) : snapshotInfos ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 700 }}>{C.LABELS.SNAPSHOT_STORAGE_USAGE_LABEL}</div>
              <SnapshotStorageBar
                percentUsed={snapshotInfos.consumedSpace.percent ?? 0}
                metricsLine={`${snapshotInfos.consumedSpace.mb.toFixed(2)} MB / ${snapshotInfos.totalPVCSpace.mb.toFixed(2)} MB`}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 600 }}>
                  {C.LABELS.SNAPSHOT_STORAGE_CONSUMED}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: DEFAULT_COLORS.TEXT_PRIMARY,
                    fontWeight: 700,
                  }}
                >
                  {consumedLine}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 600 }}>
                  {C.LABELS.SNAPSHOT_STORAGE_AVAILABLE}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: DEFAULT_COLORS.TEXT_PRIMARY,
                    fontWeight: 700,
                  }}
                >
                  {availableLine}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 600 }}>
                  {C.LABELS.SNAPSHOT_STORAGE_TOTAL_SNAPSHOTS}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: DEFAULT_COLORS.TEXT_PRIMARY,
                    fontWeight: 700,
                  }}
                >
                  {snapshotInfos.totalSnapshots}
                </span>
              </div>
            </div>
          </>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontWeight: 700 }}>{C.LABELS.SNAPSHOTS_MAX_PER_APP_LABEL}</div>
          <Select
            size="small"
            value={snapshotsMaxSelection}
            onChange={(val) => {
              setSnapshotsMaxSelection(val);
              if (val === 'custom') {
                setSnapshotsMaxPerApp(customSnapshotsMaxPerApp);
                return;
              }
              const n = Number(val);
              setCustomSnapshotsMaxPerApp(n);
              setSnapshotsMaxPerApp(n);
            }}
            options={[
              ...SNAPSHOTS_MAX_PRESET.map((n) => ({ value: String(n), label: String(n) })),
              { value: 'custom', label: 'Custom' },
            ]}
            style={{ width: '100%' }}
          />
          {snapshotsMaxSelection === 'custom' ? (
            <InputNumber
              size="small"
              min={1}
              precision={0}
              value={customSnapshotsMaxPerApp}
              onChange={(v) => {
                const n = Number(v);
                if (!Number.isFinite(n) || n <= 0) return;
                const next = Math.floor(n);
                setCustomSnapshotsMaxPerApp(next);
                setSnapshotsMaxPerApp(next);
              }}
              style={{ width: '100%' }}
            />
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title={!canEditSnapshotStorage ? C.LABELS.EDIT_SNAPSHOT_STORAGE_PERMISSION_DENIED : undefined}>
            <span style={!canEditSnapshotStorage ? { display: 'inline-block', cursor: 'not-allowed' } : {}}>
              <Button
                loading={savingSnapshotsMax}
                onClick={saveSnapshotsMax}
                disabled={!snapshotsHasChanges || !canEditSnapshotStorage}
                style={saveButtonStyle(!snapshotsHasChanges || !canEditSnapshotStorage)}
              >
                Save
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>
    </SettingsCard>
  );
});

SnapshotStorageSection.displayName = 'SnapshotStorageSection';

export default SnapshotStorageSection;
