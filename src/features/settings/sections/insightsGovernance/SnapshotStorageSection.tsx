import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { InputNumber, Select, App as AntdApp } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { SettingsDetails, SettingsField, SettingsHint } from '../../components/SettingsFields';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import { Client, exporterApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch } from '../../../../store';
import SnapshotStorageBar from '../../../applications/components/snapshots/SnapshotStorageBar';
import { getSnapshotInfos } from '../../../applications/clients';
import type { SnapshotStorageInfos } from '../../../applications/models';
import { SETTINGS_CONSTANTS } from '../../constants';
import { INSIGHTS_GOVERNANCE_CONSTANTS as C } from './constants';
import {
  ACTION_PERMISSIONS,
  usePermission,
} from '../../../auth/hooks/permissions/permissionEngine';

const EDIT_SNAPSHOT_STORAGE_PERMISSION = ACTION_PERMISSIONS.settings.editSnapshotStorage;
const VIEW_SNAPSHOTS_PERMISSION = ACTION_PERMISSIONS.applications.viewSnapshots;
const SNAPSHOTS_MAX_PRESET = [3, 5, 10, 15, 20] as const;

const SnapshotStorageSection: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const canEditSnapshotStorage = usePermission(
    EDIT_SNAPSHOT_STORAGE_PERMISSION.scope,
    EDIT_SNAPSHOT_STORAGE_PERMISSION.level,
    EDIT_SNAPSHOT_STORAGE_PERMISSION.deny,
  );
  const canViewSnapshotStorage = usePermission(
    VIEW_SNAPSHOTS_PERMISSION.scope,
    VIEW_SNAPSHOTS_PERMISSION.level,
    VIEW_SNAPSHOTS_PERMISSION.deny,
  );
  const { message } = AntdApp.useApp();

  const [initialSnapshots, setInitialSnapshots] = useState<{ maxPerApp: number } | null>(null);
  const [snapshotsMaxPerApp, setSnapshotsMaxPerApp] = useState<number>(5);
  const [snapshotsMaxSelection, setSnapshotsMaxSelection] = useState<string>('5');
  const [customSnapshotsMaxPerApp, setCustomSnapshotsMaxPerApp] = useState<number>(5);
  const [savingSnapshotsMax, setSavingSnapshotsMax] = useState(false);
  const [snapshotInfos, setSnapshotInfos] = useState<SnapshotStorageInfos | null>(null);
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
      setSnapshotsMaxSelection(C.SNAPSHOTS_CUSTOM_VALUE);
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
      setSnapshotInfos(await getSnapshotInfos());
    } catch {
      setSnapshotInfos(null);
      message.error(C.MESSAGES.SNAPSHOT_STORAGE_LOAD_FAILED);
    } finally {
      setSnapshotInfosLoading(false);
    }
  }, [message]);

  useEffect(() => {
    if (canViewSnapshotStorage) loadSnapshotInfos();
  }, [loadSnapshotInfos, canViewSnapshotStorage]);

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
  }, [dispatch, loadSnapshotInfos, snapshotsMaxPerApp, message]);

  const consumedLine = useMemo(() => {
    if (!snapshotInfos) return null;
    return `${snapshotInfos.consumedSpace.mb.toFixed(2)} MB (${snapshotInfos.consumedSpace.percent?.toFixed(2) ?? '0.00'}%)`;
  }, [snapshotInfos]);

  const availableLine = useMemo(() => {
    if (!snapshotInfos) return null;
    return `${snapshotInfos.availableSpace.mb.toFixed(2)} MB (${snapshotInfos.availableSpace.percent?.toFixed(2) ?? '0.00'}%)`;
  }, [snapshotInfos]);

  const saveToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: SETTINGS_CONSTANTS.TOOLBAR.SAVE_KEY,
          label: C.LABELS.SAVE_BUTTON,
          variant: 'primary',
          loading: savingSnapshotsMax,
          disabled: !snapshotsHasChanges || !canEditSnapshotStorage,
          tooltip: canEditSnapshotStorage
            ? undefined
            : C.LABELS.EDIT_SNAPSHOT_STORAGE_PERMISSION_DENIED,
          onClick: saveSnapshotsMax,
        },
      ],
    }),
    [savingSnapshotsMax, snapshotsHasChanges, canEditSnapshotStorage, saveSnapshotsMax],
  );

  return (
    <SettingsCard
      title={C.LABELS.SNAPSHOT_STORAGE_TITLE}
      description={C.LABELS.SNAPSHOT_STORAGE_DESCRIPTION}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!canViewSnapshotStorage ? (
          <SettingsHint>{C.LABELS.SNAPSHOT_STORAGE_NO_ACCESS}</SettingsHint>
        ) : snapshotInfosLoading ? (
          <SettingsHint>{C.LABELS.SNAPSHOT_STORAGE_LOADING}</SettingsHint>
        ) : snapshotInfos ? (
          <>
            <SettingsField label={C.LABELS.SNAPSHOT_STORAGE_USAGE_LABEL}>
              <SnapshotStorageBar
                percentUsed={snapshotInfos.consumedSpace.percent ?? 0}
                metricsLine={`${snapshotInfos.consumedSpace.mb.toFixed(2)} MB / ${snapshotInfos.totalPVCSpace.mb.toFixed(2)} MB`}
              />
            </SettingsField>
            <SettingsDetails
              items={[
                { label: C.LABELS.SNAPSHOT_STORAGE_CONSUMED, value: consumedLine },
                { label: C.LABELS.SNAPSHOT_STORAGE_AVAILABLE, value: availableLine },
                {
                  label: C.LABELS.SNAPSHOT_STORAGE_TOTAL_SNAPSHOTS,
                  value: snapshotInfos.totalSnapshots,
                },
              ]}
            />
          </>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SettingsField
            label={C.LABELS.SNAPSHOTS_MAX_PER_APP_LABEL}
            info={C.LABELS.SNAPSHOTS_MAX_PER_APP_HINT}
          >
            <Select
              value={snapshotsMaxSelection}
              disabled={!canEditSnapshotStorage}
              onChange={(val) => {
                setSnapshotsMaxSelection(val);
                if (val === C.SNAPSHOTS_CUSTOM_VALUE) {
                  setSnapshotsMaxPerApp(customSnapshotsMaxPerApp);
                  return;
                }
                const n = Number(val);
                setCustomSnapshotsMaxPerApp(n);
                setSnapshotsMaxPerApp(n);
              }}
              options={[
                ...SNAPSHOTS_MAX_PRESET.map((n) => ({ value: String(n), label: String(n) })),
                { value: C.SNAPSHOTS_CUSTOM_VALUE, label: C.LABELS.CUSTOM_OPTION },
              ]}
              style={{ width: '100%' }}
            />
          </SettingsField>
          {snapshotsMaxSelection === C.SNAPSHOTS_CUSTOM_VALUE ? (
            <InputNumber
              min={1}
              precision={0}
              value={customSnapshotsMaxPerApp}
              disabled={!canEditSnapshotStorage}
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
          <Toolbar config={saveToolbarConfig} />
        </div>
      </div>
    </SettingsCard>
  );
});

SnapshotStorageSection.displayName = 'SnapshotStorageSection';

export default SnapshotStorageSection;
