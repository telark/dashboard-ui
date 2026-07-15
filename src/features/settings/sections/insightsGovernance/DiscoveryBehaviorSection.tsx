import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { InputNumber, Select, Tooltip, App as AntdApp } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import { Client, discoveryApiClient, exporterApiClient } from '../../../../api';
import { DEFAULT_COLORS, Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch, RootState } from '../../../../store';
import { INSIGHTS_GOVERNANCE_CONSTANTS as C } from './constants';
import { usePermission } from '../../../auth/hooks/permissions/permissionEngine';

const FETCH_INTERVAL_PRESET_MINUTES = [1, 2, 5, 10, 15, 30, 60] as const;

function snapDownToPreset(value: number, presets: readonly number[]): number {
  const v = Math.floor(value);
  let best = presets[0] ?? 1;
  for (const p of presets) {
    if (p <= v) best = p;
  }
  return best;
}

const DiscoveryBehaviorSection: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const applications = useSelector((s: RootState) => s.applications.applications);
  const canEditDiscoveryConfig = usePermission('settings', 'Contributor');
  const { message } = AntdApp.useApp();

  const [initialDiscovery, setInitialDiscovery] = useState<{
    excludedNamespaces: string[];
    fetchIntervalMinutes: number;
  } | null>(null);
  const [namespacesOptions, setNamespacesOptions] = useState<string[]>([]);
  const [excludedNamespaces, setExcludedNamespaces] = useState<string[]>([]);
  const [savingDiscoveryBehavior, setSavingDiscoveryBehavior] = useState(false);
  const [fetchIntervalMinutes, setFetchIntervalMinutes] = useState<number>(1);
  const [fetchIntervalSelection, setFetchIntervalSelection] = useState<string>('1');
  const [customFetchIntervalMinutes, setCustomFetchIntervalMinutes] = useState<number>(1);

  useEffect(() => {
    if (!globalConfig?.data) return;
    const cfg = globalConfig.data;
    const savedExcluded = Array.isArray(cfg?.excludedNamespaces) ? cfg.excludedNamespaces : [];
    setExcludedNamespaces(savedExcluded);
    const seconds = Number(cfg?.userSettings?.fetchIntervalSeconds ?? 60);
    const rawMinutes = Math.max(1, Math.floor(seconds / 60));
    const minutes = FETCH_INTERVAL_PRESET_MINUTES.includes(
      rawMinutes as (typeof FETCH_INTERVAL_PRESET_MINUTES)[number],
    )
      ? rawMinutes
      : snapDownToPreset(rawMinutes, FETCH_INTERVAL_PRESET_MINUTES);
    setFetchIntervalMinutes(minutes);
    setFetchIntervalSelection(String(minutes));
    setCustomFetchIntervalMinutes(minutes);
    setInitialDiscovery({
      excludedNamespaces: [...savedExcluded].sort(),
      fetchIntervalMinutes: minutes,
    });
  }, [globalConfig?.data]);

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
  }, [message]);

  useEffect(() => {
    loadNamespaces();
  }, [loadNamespaces]);

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
  }, [dispatch, excludedNamespaces, fetchIntervalMinutes, message]);

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
        <span className="ant-select-selection-item">
          <span className="ant-select-selection-item-content">+{hidden.length}</span>
        </span>
      </Tooltip>
    );
  }, []);

  const saveToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: 'save',
          label: C.LABELS.SAVE_BUTTON,
          variant: 'default',
          loading: savingDiscoveryBehavior,
          disabled: !discoveryHasChanges || !canEditDiscoveryConfig,
          tooltip: canEditDiscoveryConfig
            ? undefined
            : C.LABELS.EDIT_DISCOVERY_CONFIG_PERMISSION_DENIED,
          onClick: saveDiscoveryAndBehavior,
        },
      ],
    }),
    [
      savingDiscoveryBehavior,
      discoveryHasChanges,
      canEditDiscoveryConfig,
      saveDiscoveryAndBehavior,
    ],
  );

  return (
    <SettingsCard
      title="Discovery & Behavior"
      description="Scope discovery and insights by namespace, and control the fetch interval."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Select
          mode="multiple"
          size="small"
          value={excludedNamespaces}
          onChange={(vals) => setExcludedNamespaces(vals)}
          options={namespacesOptions.map((n) => ({ value: n, label: n }))}
          placeholder={C.LABELS.NAMESPACES_SELECTOR_PLACEHOLDER}
          style={{ width: '100%' }}
          maxTagCount={5}
          maxTagPlaceholder={maxNamespaceTagPlaceholder}
          disabled={!canEditDiscoveryConfig}
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
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 700 }}>{C.LABELS.FETCH_INTERVAL_MINUTES_LABEL}</div>
          <Select
            size="small"
            value={fetchIntervalSelection}
            disabled={!canEditDiscoveryConfig}
            onChange={(val) => {
              const raw = String(val);
              if (raw === 'custom') {
                setFetchIntervalSelection('custom');
                setFetchIntervalMinutes(customFetchIntervalMinutes);
                return;
              }
              const parsed = Number(raw);
              const minutes = FETCH_INTERVAL_PRESET_MINUTES.includes(
                parsed as (typeof FETCH_INTERVAL_PRESET_MINUTES)[number],
              )
                ? parsed
                : snapDownToPreset(parsed, FETCH_INTERVAL_PRESET_MINUTES);
              setFetchIntervalSelection(String(minutes));
              setCustomFetchIntervalMinutes(minutes);
              setFetchIntervalMinutes(minutes);
            }}
            options={[
              ...FETCH_INTERVAL_PRESET_MINUTES.map((m) => ({
                value: String(m),
                label: m === 60 ? '1 hour' : `${m} minute${m === 1 ? '' : 's'}`,
              })),
              { value: 'custom', label: 'Custom' },
            ]}
            style={{ width: '100%' }}
          />
          {fetchIntervalSelection === 'custom' ? (
            <InputNumber
              size="small"
              min={1}
              precision={0}
              value={customFetchIntervalMinutes}
              disabled={!canEditDiscoveryConfig}
              onChange={(v) => {
                const n = Number(v);
                if (!Number.isFinite(n) || n <= 0) return;
                const next = Math.floor(n);
                setCustomFetchIntervalMinutes(next);
                setFetchIntervalMinutes(next);
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

DiscoveryBehaviorSection.displayName = 'DiscoveryBehaviorSection';

export default DiscoveryBehaviorSection;
