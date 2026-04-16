import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Tooltip, message } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import {
  Client,
  discoveryApiClient,
  enrichmentApiClient,
  exporterApiClient,
} from '../../../../api';
import { Endpoints } from '../../../../constants';
import { INSIGHTS_GOVERNANCE_CONSTANTS as C, ProviderKey } from './constants';
import { DEFAULT_COLORS } from '../../../../constants';
import { Switch } from '../../../../components/display/inputs';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch, RootState } from '../../../../store';
import { fetchGlobalConfigThunk } from '../../../globalconfig/store';
import SnapshotStorageBar from '../../../resources/applications/components/snapshots/SnapshotStorageBar';

const SECTION_GAP_PX = 12;
const PLATFORM_INPUT_WIDTH_PX = 160;

type ValidationApiResponse = { ok: boolean; reason?: string };
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

function getFriendlyValidationError(err: unknown): string {
  if (err && typeof err === 'object') {
    const anyErr = err as {
      response?: { data?: unknown };
      normalized?: { message?: string };
      message?: string;
    };
    const data = anyErr.response?.data;
    if (data && typeof data === 'object' && 'reason' in data) {
      const reason = String((data as { reason?: unknown }).reason || '').trim();
      if (reason) return reason;
    }
    const normalizedMsg = String(anyErr.normalized?.message || '').trim();
    if (normalizedMsg) return normalizedMsg;
    const msg = String(anyErr.message || '').trim();
    if (msg) return msg;
  }
  return C.MESSAGES.VALIDATION_FAILED;
}

const AIInsightsGovernanceSectionContent: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const applications = useSelector((s: RootState) => s.applications.applications);

  const [initialAi, setInitialAi] = useState<{
    enabled: boolean;
    provider: ProviderKey;
    apiKey: string;
  } | null>(null);
  const [initialDiscovery, setInitialDiscovery] = useState<{
    excludedNamespaces: string[];
    fetchIntervalMinutes: number;
  } | null>(null);
  const [initialSnapshots, setInitialSnapshots] = useState<{ maxPerApp: number } | null>(null);

  const [aiEnabled, setAiEnabled] = useState(false);
  const [provider, setProvider] = useState<ProviderKey>(C.PROVIDERS.DEFAULT);
  const [apiKey, setApiKey] = useState('');
  const [lastValidatedKey, setLastValidatedKey] = useState<string | null>(null);
  const [validMessage, setValidMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);

  const [namespacesOptions, setNamespacesOptions] = useState<string[]>([]);
  const [excludedNamespaces, setExcludedNamespaces] = useState<string[]>([]);
  const [savingDiscoveryBehavior, setSavingDiscoveryBehavior] = useState(false);

  const [fetchIntervalMinutes, setFetchIntervalMinutes] = useState<number>(1);
  const [snapshotsMaxPerApp, setSnapshotsMaxPerApp] = useState<number>(5);
  const [savingSnapshotsMax, setSavingSnapshotsMax] = useState(false);
  const [snapshotInfos, setSnapshotInfos] = useState<SnapshotInfosResponse | null>(null);
  const [snapshotInfosLoading, setSnapshotInfosLoading] = useState(false);

  useEffect(() => {
    if (!globalConfig?.data) return;
    const cfg = globalConfig.data;

    const enabled = Boolean(cfg?.ai?.enabled);
    setAiEnabled(enabled);

    const allowed = C.PROVIDERS.OPTIONS.map((o) => o.value);
    const p = String(cfg?.ai?.provider || '').trim();
    const normalizedProvider = allowed.includes(p as ProviderKey)
      ? (p as ProviderKey)
      : C.PROVIDERS.DEFAULT;
    setProvider(normalizedProvider);

    const key = String(cfg?.ai?.apiKey || '');
    setApiKey(key);
    setLastValidatedKey(key ? key.trim() : null);

    const savedExcluded = Array.isArray(cfg?.excludedNamespaces) ? cfg.excludedNamespaces : [];
    setExcludedNamespaces(savedExcluded);

    const seconds = Number(cfg?.userSettings?.fetchIntervalSeconds ?? 60);
    const minutes = Math.max(1, Math.round(seconds / 60));
    setFetchIntervalMinutes(minutes);

    const maxPerApp = Number(cfg?.snapshots?.maxPerApp ?? 5);
    const normalizedMax = Number.isFinite(maxPerApp) ? maxPerApp : 5;
    setSnapshotsMaxPerApp(normalizedMax);

    setInitialAi({ enabled, provider: normalizedProvider, apiKey: key });
    setInitialDiscovery({
      excludedNamespaces: [...savedExcluded].sort(),
      fetchIntervalMinutes: minutes,
    });
    setInitialSnapshots({ maxPerApp: normalizedMax });
  }, [globalConfig?.data]);

  const aiHasChanges = useMemo(() => {
    if (!initialAi) return false;
    if (aiEnabled !== initialAi.enabled) return true;
    if (!aiEnabled && !initialAi.enabled) return false;
    if (provider !== initialAi.provider) return true;
    return apiKey !== initialAi.apiKey;
  }, [aiEnabled, apiKey, initialAi, provider]);

  const discoveryHasChanges = useMemo(() => {
    if (!initialDiscovery) return false;
    const current = [...(excludedNamespaces || [])].sort();
    const initial = initialDiscovery.excludedNamespaces;
    if (current.length !== initial.length) return true;
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== initial[i]) return true;
    }
    return fetchIntervalMinutes !== initialDiscovery.fetchIntervalMinutes;
  }, [excludedNamespaces, fetchIntervalMinutes, initialDiscovery]);

  const snapshotsHasChanges = useMemo(() => {
    if (!initialSnapshots) return false;
    return snapshotsMaxPerApp !== initialSnapshots.maxPerApp;
  }, [initialSnapshots, snapshotsMaxPerApp]);

  const validateDisabled = useMemo(() => {
    const trimmed = apiKey.trim();
    if (!trimmed) return true;
    return Boolean(lastValidatedKey && trimmed === lastValidatedKey);
  }, [apiKey, lastValidatedKey]);

  const canEnable = useMemo(() => {
    if (!aiEnabled) return true;
    const trimmed = apiKey.trim();
    return Boolean(trimmed && trimmed === lastValidatedKey);
  }, [aiEnabled, apiKey, lastValidatedKey]);

  const onProviderChange = useCallback((val: ProviderKey) => {
    setProvider(val);
    setLastValidatedKey(null);
    setValidMessage(null);
    setErrorMessage(null);
  }, []);

  const validateKey = useCallback(async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setErrorMessage(C.MESSAGES.API_KEY_REQUIRED);
      return;
    }
    setValidating(true);
    setErrorMessage(null);
    setValidMessage(null);
    try {
      const { path, method } = Endpoints.PROVIDERS.VALIDATE_API_KEY;
      const res = await Client<ValidationApiResponse>(enrichmentApiClient, path, {
        method,
        data: { provider, apiKey: trimmed },
      });
      const ok = Boolean(res?.ok);
      if (!ok) {
        const reason = String(res?.reason || '').trim();
        setErrorMessage(reason || C.MESSAGES.VALIDATION_FAILED);
        return;
      }
      setLastValidatedKey(trimmed);
      setValidMessage(C.LABELS.KEY_VALID);
      message.success(C.MESSAGES.VALIDATION_SUCCESS);
    } catch (err: unknown) {
      setErrorMessage(getFriendlyValidationError(err));
    } finally {
      setValidating(false);
    }
  }, [apiKey, provider]);

  const handleEnable = useCallback(async () => {
    setSaving(true);
    setErrorMessage(null);
    setValidMessage(null);
    try {
      const { path, method } = Endpoints.GLOBALCONFIG.PATCH;
      await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path, {
        method,
        data: { ai: { enabled: aiEnabled, provider, apiKey: apiKey.trim() } },
      });
      message.success(C.MESSAGES.SAVE_SUCCESS);
      setInitialAi({ enabled: aiEnabled, provider, apiKey });
      dispatch(fetchGlobalConfigThunk());
    } catch (err: unknown) {
      message.error(getFriendlyValidationError(err) || C.MESSAGES.SAVE_FAILED);
    } finally {
      setSaving(false);
    }
  }, [aiEnabled, apiKey, dispatch, provider]);

  const loadNamespaces = useCallback(async () => {
    try {
      const { path, method } = Endpoints.NAMESPACES.GET;
      const res = await Client<ResourceDetailsResponse<string[]>>(discoveryApiClient, path, {
        method,
      });
      const all = (res?.data ?? []).filter(Boolean);
      setNamespacesOptions(all);
    } catch {
      message.error(C.MESSAGES.NAMESPACES_LOAD_FAILED);
    }
  }, []);

  useEffect(() => {
    loadNamespaces();
  }, [loadNamespaces]);

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

  const saveDiscoveryAndBehavior = useCallback(async () => {
    setSavingDiscoveryBehavior(true);
    try {
      const seconds = Math.max(1, Math.round(fetchIntervalMinutes)) * 60;
      const { path, method } = Endpoints.GLOBALCONFIG.PATCH;
      await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path, {
        method,
        data: { excludedNamespaces, userSettings: { fetchIntervalSeconds: seconds } },
      });
      message.success(C.MESSAGES.SAVE_SUCCESS);
      setInitialDiscovery({
        excludedNamespaces: [...(excludedNamespaces || [])].sort(),
        fetchIntervalMinutes,
      });
      dispatch(fetchGlobalConfigThunk());
    } catch {
      message.error(C.MESSAGES.SAVE_FAILED);
    } finally {
      setSavingDiscoveryBehavior(false);
    }
  }, [dispatch, excludedNamespaces, fetchIntervalMinutes]);

  const saveSnapshotsMax = useCallback(async () => {
    setSavingSnapshotsMax(true);
    try {
      const maxPerApp = Math.max(1, Math.round(snapshotsMaxPerApp));
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

  const namespacesImpactPreview = useMemo(() => {
    const saved = Array.isArray(globalConfig?.data?.excludedNamespaces)
      ? globalConfig.data.excludedNamespaces
      : [];
    const current = excludedNamespaces || [];
    const savedSet = new Set(saved);
    const currentSet = new Set(current);

    if (saved.length === current.length) {
      let same = true;
      for (const v of saved) {
        if (!currentSet.has(v)) {
          same = false;
          break;
        }
      }
      if (same) return null;
    }

    const added = new Set<string>();
    const removed = new Set<string>();
    for (const ns of currentSet) {
      if (!savedSet.has(ns)) added.add(ns);
    }
    for (const ns of savedSet) {
      if (!currentSet.has(ns)) removed.add(ns);
    }
    if (added.size === 0 && removed.size === 0) return null;

    let hidden = 0;
    let revealed = 0;
    for (const a of applications || []) {
      const primary = a.namespaces?.items?.[0]?.name ?? '';
      if (!primary) continue;
      if (added.has(primary)) hidden++;
      if (removed.has(primary)) revealed++;
    }

    if (hidden === 0 && revealed === 0) return null;
    return { hidden, revealed };
  }, [applications, excludedNamespaces, globalConfig?.data?.excludedNamespaces]);

  const maxNamespaceTagPlaceholder = useCallback((omitted: Array<{ value?: unknown }>) => {
    const hidden = omitted.map((v) => String(v.value ?? '')).filter(Boolean);
    if (hidden.length === 0) return null;
    return (
      <Tooltip title={hidden.join(', ')}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 24,
            padding: '0 10px',
            borderRadius: 6,
            background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
            color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'default',
          }}
        >
          +{hidden.length}
        </span>
      </Tooltip>
    );
  }, []);

  return (
    <>
      <SettingsCard title="AI Insights" description={C.LABELS.AI_INSIGHTS_DESCRIPTION}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              padding: '2px 0',
            }}
          >
            <div style={{ fontWeight: 700 }}>{C.LABELS.ENABLE_AI_LABEL}</div>
            <Switch checked={aiEnabled} onChange={setAiEnabled} />
          </div>

          {aiEnabled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Select
                value={provider}
                options={C.PROVIDERS.OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                onChange={onProviderChange}
                style={{ width: 240 }}
              />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Input
                  placeholder={C.LABELS.API_KEY_PLACEHOLDER}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setValidMessage(null);
                    setErrorMessage(null);
                  }}
                  style={{ flex: 1 }}
                />
                <Button loading={validating} disabled={validateDisabled} onClick={validateKey}>
                  {C.LABELS.VALIDATE_BUTTON}
                </Button>
              </div>

              {validMessage ? (
                <div style={{ color: C.COLORS.SUCCESS_TEXT, fontWeight: 700 }}>{validMessage}</div>
              ) : null}
              {errorMessage ? (
                <div style={{ color: C.COLORS.ERROR_TEXT, fontWeight: 700 }}>{errorMessage}</div>
              ) : null}
            </div>
          ) : null}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleEnable}
              loading={saving}
              disabled={!aiHasChanges || !canEnable}
              style={{
                minWidth: 120,
                background: DEFAULT_COLORS.SUCCESS,
                borderColor: DEFAULT_COLORS.SUCCESS,
                color: '#fff',
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </SettingsCard>

      <div style={{ marginTop: SECTION_GAP_PX }}>
        <SettingsCard
          title="Discovery & Behavior"
          description="Scope discovery and insights by namespace, and control the fetch interval."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Select
              mode="multiple"
              value={excludedNamespaces}
              onChange={(vals) => setExcludedNamespaces(vals)}
              options={namespacesOptions.map((n) => ({ value: n, label: n }))}
              placeholder={C.LABELS.NAMESPACES_SELECTOR_PLACEHOLDER}
              style={{ width: '100%' }}
              maxTagCount={5}
              maxTagPlaceholder={maxNamespaceTagPlaceholder}
            />
            {namespacesImpactPreview ? (
              <div style={{ fontSize: 12, fontWeight: 700, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {namespacesImpactPreview.hidden > 0 ? (
                  <span>
                    {namespacesImpactPreview.hidden} application
                    {namespacesImpactPreview.hidden === 1 ? '' : 's'} will be hidden
                  </span>
                ) : null}
                {namespacesImpactPreview.hidden > 0 && namespacesImpactPreview.revealed > 0 ? (
                  <span style={{ fontWeight: 600 }}> · </span>
                ) : null}
                {namespacesImpactPreview.revealed > 0 ? (
                  <span>
                    {namespacesImpactPreview.revealed} application
                    {namespacesImpactPreview.revealed === 1 ? '' : 's'} will be revealed
                  </span>
                ) : null}
              </div>
            ) : null}

            <div
              style={{
                borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                paddingTop: 12,
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ fontWeight: 700 }}>{C.LABELS.FETCH_INTERVAL_MINUTES_LABEL}</div>
              <Input
                value={String(fetchIntervalMinutes)}
                onChange={(e) => setFetchIntervalMinutes(Number(e.target.value || 0))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                loading={savingDiscoveryBehavior}
                onClick={saveDiscoveryAndBehavior}
                style={{
                  minWidth: 120,
                  background: DEFAULT_COLORS.SUCCESS,
                  borderColor: DEFAULT_COLORS.SUCCESS,
                  color: '#fff',
                }}
                disabled={!discoveryHasChanges}
              >
                Save
              </Button>
            </div>
          </div>
        </SettingsCard>
      </div>

      <div style={{ marginTop: SECTION_GAP_PX }}>
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
                    <span
                      style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 600 }}
                    >
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
                    <span
                      style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 600 }}
                    >
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
                    <span
                      style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 600 }}
                    >
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
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 180, fontWeight: 700 }}>
                {C.LABELS.SNAPSHOTS_MAX_PER_APP_LABEL}
              </div>
              <Input
                value={String(snapshotsMaxPerApp)}
                onChange={(e) => setSnapshotsMaxPerApp(Number(e.target.value || 0))}
                style={{ width: PLATFORM_INPUT_WIDTH_PX }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                loading={savingSnapshotsMax}
                onClick={saveSnapshotsMax}
                style={{
                  minWidth: 120,
                  background: DEFAULT_COLORS.SUCCESS,
                  borderColor: DEFAULT_COLORS.SUCCESS,
                  color: '#fff',
                }}
                disabled={!snapshotsHasChanges}
              >
                Save
              </Button>
            </div>
          </div>
        </SettingsCard>
      </div>
    </>
  );
});

AIInsightsGovernanceSectionContent.displayName = 'AIInsightsGovernanceSectionContent';

export default AIInsightsGovernanceSectionContent;
