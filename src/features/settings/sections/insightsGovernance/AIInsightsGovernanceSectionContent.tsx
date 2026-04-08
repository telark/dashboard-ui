import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, message } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import { Client, discoveryApiClient, enrichmentApiClient, exporterApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import { INSIGHTS_GOVERNANCE_CONSTANTS as C, ProviderKey } from './constants';
import { DEFAULT_COLORS } from '../../../../constants';
import { Switch } from '../../../../components/display/inputs';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch } from '../../../../store';
import { fetchGlobalConfigThunk } from '../../../globalconfig/store';

const { CONTENT } = SETTINGS_CONSTANTS;

type ValidationApiResponse = { ok: boolean; reason?: string };
type NamespacesApiData = { allowed: string[]; excluded: string[] };

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
  const [savingNamespaces, setSavingNamespaces] = useState(false);

  const [fetchIntervalMinutes, setFetchIntervalMinutes] = useState<number>(1);
  const [snapshotsMaxPerApp, setSnapshotsMaxPerApp] = useState<number>(5);
  const [savingInterval, setSavingInterval] = useState(false);
  const [savingSnapshotsMax, setSavingSnapshotsMax] = useState(false);

  useEffect(() => {
    if (!globalConfig?.data) return;
    const cfg = globalConfig.data;

    const enabled = Boolean(cfg?.ai?.enabled);
    setAiEnabled(enabled);

    const allowed = C.PROVIDERS.OPTIONS.map((o) => o.value);
    const p = String(cfg?.ai?.provider || '').trim();
    const normalizedProvider = allowed.includes(p as ProviderKey) ? (p as ProviderKey) : C.PROVIDERS.DEFAULT;
    setProvider(normalizedProvider);

    const key = String(cfg?.ai?.apiKey || '');
    setApiKey(key);
    setLastValidatedKey(key ? key.trim() : null);

    setExcludedNamespaces(Array.isArray(cfg?.excludedNamespaces) ? cfg.excludedNamespaces : []);

    const seconds = Number(cfg?.userSettings?.fetchIntervalSeconds ?? 60);
    setFetchIntervalMinutes(Math.max(1, Math.round(seconds / 60)));

    const maxPerApp = Number(cfg?.snapshots?.maxPerApp ?? 5);
    setSnapshotsMaxPerApp(Number.isFinite(maxPerApp) ? maxPerApp : 5);
  }, [globalConfig?.data]);

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
      const res = await Client<ResourceDetailsResponse<NamespacesApiData>>(discoveryApiClient, path, {
        method,
      });
      const allowed = res?.data?.allowed ?? [];
      const excluded = res?.data?.excluded ?? [];
      const all = [...allowed, ...excluded].filter(Boolean);
      setNamespacesOptions(all);
      if (excludedNamespaces.length === 0 && excluded.length > 0) {
        setExcludedNamespaces(excluded);
      }
    } catch {
      message.error(C.MESSAGES.NAMESPACES_LOAD_FAILED);
    }
  }, [excludedNamespaces.length]);

  useEffect(() => {
    loadNamespaces();
  }, [loadNamespaces]);

  const saveNamespaces = useCallback(async () => {
    setSavingNamespaces(true);
    try {
      const { path, method } = Endpoints.GLOBALCONFIG.PATCH;
      await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path, {
        method,
        data: { excludedNamespaces },
      });
      message.success(C.MESSAGES.NAMESPACES_SAVE_SUCCESS);
      dispatch(fetchGlobalConfigThunk());
    } catch {
      message.error(C.MESSAGES.NAMESPACES_SAVE_FAILED);
    } finally {
      setSavingNamespaces(false);
    }
  }, [dispatch, excludedNamespaces]);

  const saveFetchInterval = useCallback(async () => {
    setSavingInterval(true);
    try {
      const seconds = Math.max(1, Math.round(fetchIntervalMinutes)) * 60;
      const { path, method } = Endpoints.GLOBALCONFIG.PATCH;
      await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path, {
        method,
        data: { userSettings: { fetchIntervalSeconds: seconds } },
      });
      message.success(C.MESSAGES.PLATFORM_SAVE_INTERVAL_SUCCESS);
      dispatch(fetchGlobalConfigThunk());
    } catch {
      message.error(C.MESSAGES.PLATFORM_SAVE_INTERVAL_FAILED);
    } finally {
      setSavingInterval(false);
    }
  }, [dispatch, fetchIntervalMinutes]);

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
      dispatch(fetchGlobalConfigThunk());
    } catch {
      message.error(C.MESSAGES.PLATFORM_SAVE_SNAPSHOTS_FAILED);
    } finally {
      setSavingSnapshotsMax(false);
    }
  }, [dispatch, snapshotsMaxPerApp]);

  return (
    <>
      <SettingsCard title={C.LABELS.AI_INSIGHTS_TITLE} description={C.LABELS.AI_INSIGHTS_DESCRIPTION}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 700 }}>{C.LABELS.ENABLE_AI_LABEL}</div>
          <Switch checked={aiEnabled} onChange={setAiEnabled} />
        </div>
      </SettingsCard>

      {aiEnabled ? (
        <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
          <SettingsCard title={C.LABELS.PROVIDER_CARD_TITLE} description={C.LABELS.PROVIDER_CARD_DESCRIPTION}>
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
          </SettingsCard>
        </div>
      ) : null}

      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard
          title={C.LABELS.NAMESPACES_TITLE}
          description={C.LABELS.NAMESPACES_DESCRIPTION}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Select
              mode="multiple"
              value={excludedNamespaces}
              onChange={(vals) => setExcludedNamespaces(vals)}
              options={namespacesOptions.map((n) => ({ value: n, label: n }))}
              placeholder={C.LABELS.NAMESPACES_SELECTOR_PLACEHOLDER}
              style={{ width: '100%' }}
            />
            <Button loading={savingNamespaces} onClick={saveNamespaces}>
              {C.LABELS.NAMESPACES_SAVE_BUTTON}
            </Button>
          </div>
        </SettingsCard>
      </div>

      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard title={C.LABELS.PLATFORM_TITLE} description={C.LABELS.PLATFORM_DESCRIPTION}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 180, fontWeight: 700 }}>{C.LABELS.FETCH_INTERVAL_MINUTES_LABEL}</div>
              <Input
                value={String(fetchIntervalMinutes)}
                onChange={(e) => setFetchIntervalMinutes(Number(e.target.value || 0))}
                style={{ width: 160 }}
              />
              <Button loading={savingInterval} onClick={saveFetchInterval}>
                {C.LABELS.PLATFORM_SAVE_INTERVAL_BUTTON}
              </Button>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 180, fontWeight: 700 }}>{C.LABELS.SNAPSHOTS_MAX_PER_APP_LABEL}</div>
              <Input
                value={String(snapshotsMaxPerApp)}
                onChange={(e) => setSnapshotsMaxPerApp(Number(e.target.value || 0))}
                style={{ width: 160 }}
              />
              <Button loading={savingSnapshotsMax} onClick={saveSnapshotsMax}>
                {C.LABELS.PLATFORM_SAVE_SNAPSHOTS_BUTTON}
              </Button>
            </div>
          </div>
        </SettingsCard>
      </div>

      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard title={C.LABELS.SAVE_TITLE} description={C.LABELS.SAVE_DESCRIPTION}>
          <Button
            type="primary"
            onClick={handleEnable}
            loading={saving}
            disabled={!canEnable}
            style={{
              background: DEFAULT_COLORS.SUCCESS,
              borderColor: DEFAULT_COLORS.SUCCESS,
            }}
          >
            {C.LABELS.ENABLE_BUTTON}
          </Button>
        </SettingsCard>
      </div>
    </>
  );
});

AIInsightsGovernanceSectionContent.displayName = 'AIInsightsGovernanceSectionContent';

export default AIInsightsGovernanceSectionContent;

