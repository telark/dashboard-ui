import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, message } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import { Client, discoveryApiClient, enrichmentApiClient, exporterApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import { AI_DATA_CONSTANTS as C, ProviderKey } from './constants';
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

const AIDataSectionContent: React.FC = memo(() => {
  const globalConfig = useSelector(selectGlobalConfigState);
  const dispatch: AppDispatch = useDispatch();
  const [aiEnabled, setAIEnabled] = useState(false);
  const [provider, setProvider] = useState<ProviderKey>(C.PROVIDERS.DEFAULT);
  const [apiKey, setApiKey] = useState('');
  const [validating, setValidating] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [validationReason, setValidationReason] = useState<string | null>(null);
  const [lastValidatedKey, setLastValidatedKey] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [namespacesLoading, setNamespacesLoading] = useState(false);
  const [namespacesSaving, setNamespacesSaving] = useState(false);
  const [namespaceOptions, setNamespaceOptions] = useState<string[]>([]);
  const [defaultExcludedNamespaces, setDefaultExcludedNamespaces] = useState<string[]>([]);
  const [excludedNamespaces, setExcludedNamespaces] = useState<string[]>([]);
  const [fetchIntervalMinutes, setFetchIntervalMinutes] = useState<number>(1);
  const [snapshotsMaxPerApp, setSnapshotsMaxPerApp] = useState<number>(5);
  const [savingInterval, setSavingInterval] = useState(false);
  const [savingSnapshots, setSavingSnapshots] = useState(false);

  const normalizeProvider = useCallback((raw: unknown): ProviderKey => {
    const val = String(raw || '').trim().toLowerCase();
    const allowed = C.PROVIDERS.OPTIONS.map((o) => o.value);
    return (allowed.includes(val as ProviderKey) ? (val as ProviderKey) : C.PROVIDERS.DEFAULT);
  }, []);

  const loadNamespaces = useCallback(async () => {
    setNamespacesLoading(true);
    try {
      const resp = await Client<ResourceDetailsResponse<NamespacesApiData>>(
        discoveryApiClient,
        Endpoints.NAMESPACES.GET.path,
        { method: Endpoints.NAMESPACES.GET.method },
      );
      const data = resp?.data;
      const allowed = Array.isArray(data?.allowed) ? data.allowed : [];
      const excluded = Array.isArray(data?.excluded) ? data.excluded : [];
      const all = [...allowed, ...excluded].map((n) => String(n)).filter(Boolean);

      setNamespaceOptions(Array.from(new Set(all)).sort((a, b) => a.localeCompare(b)));
      setDefaultExcludedNamespaces(excluded.map((n) => String(n)).filter(Boolean));
    } catch (e) {
      message.error(getFriendlyValidationError(e) || C.MESSAGES.NAMESPACES_LOAD_FAILED);
    } finally {
      setNamespacesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNamespaces();
  }, [loadNamespaces]);

  useEffect(() => {
    if (globalConfig.error) {
      message.error(globalConfig.error);
    }
  }, [globalConfig.error]);

  useEffect(() => {
    const cfg = globalConfig.data;
    if (!cfg) return;

    const ai = cfg.ai;
    const hydratedEnabled = Boolean(ai?.enabled);
    const hydratedProvider = normalizeProvider(ai?.provider);
    const key = typeof ai?.apiKey === 'string' ? ai.apiKey.trim() : '';
    const hydratedRequiresKey = hydratedProvider !== C.PROVIDERS.DEFAULT;

    setAIEnabled(hydratedEnabled);
    setProvider(hydratedProvider);
    setApiKey(key);

    setValidationReason(null);
    setLastValidatedKey(key);
    setIsKeyValid(!hydratedRequiresKey || key.length > 0);

    if (Array.isArray(cfg.excludedNamespaces)) {
      setExcludedNamespaces(cfg.excludedNamespaces.map((x) => String(x)).filter(Boolean));
    }
    const seconds = Number(cfg.userSettings?.fetchIntervalSeconds || 60);
    setFetchIntervalMinutes(Math.max(1, Math.round(seconds / 60)));
    const maxPerApp = Number(cfg.snapshots?.maxPerApp || 5);
    setSnapshotsMaxPerApp(Math.max(1, maxPerApp));
  }, [globalConfig.data, normalizeProvider]);

  useEffect(() => {
    if (excludedNamespaces.length > 0) return;
    if (defaultExcludedNamespaces.length === 0) return;
    setExcludedNamespaces(defaultExcludedNamespaces);
  }, [defaultExcludedNamespaces, excludedNamespaces.length]);

  const requiresKey = provider !== C.PROVIDERS.DEFAULT;

  const canEnable = useMemo(() => {
    if (!aiEnabled) return true;
    if (!requiresKey) return true;
    const trimmed = apiKey.trim();
    const isSavedKey = lastValidatedKey.length > 0 && trimmed === lastValidatedKey;
    return isSavedKey || isKeyValid;
  }, [aiEnabled, apiKey, isKeyValid, lastValidatedKey, requiresKey]);

  const validateKey = useCallback(async () => {
    if (!requiresKey) {
      setIsKeyValid(true);
      setValidationReason(null);
      return;
    }
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setIsKeyValid(false);
      setValidationReason(C.MESSAGES.API_KEY_REQUIRED);
      return;
    }
    setValidating(true);
    setIsKeyValid(false);
    setValidationReason(null);
    try {
      const resp = await Client<ValidationApiResponse>(
        enrichmentApiClient,
        Endpoints.PROVIDERS.VALIDATE_API_KEY.path,
        {
          method: Endpoints.PROVIDERS.VALIDATE_API_KEY.method,
          data: { provider, api_key: trimmed },
        },
      );
      if (resp?.ok) {
        setIsKeyValid(true);
        setValidationReason(null);
        setLastValidatedKey(trimmed);
        message.success(C.MESSAGES.VALIDATION_SUCCESS);
      } else {
        setIsKeyValid(false);
        const reason = resp?.reason || C.MESSAGES.VALIDATION_FAILED;
        setValidationReason(reason);
        message.error(reason);
      }
    } catch (e) {
      setIsKeyValid(false);
      const friendly = getFriendlyValidationError(e);
      setValidationReason(friendly);
      message.error(friendly);
    } finally {
      setValidating(false);
    }
  }, [apiKey, provider, requiresKey]);

  const handleEnable = useCallback(async () => {
    if (!canEnable) return;
    setSubmitting(true);
    try {
      const patch = {
        ai: {
          enabled: aiEnabled,
          provider,
          apiKey: requiresKey ? apiKey.trim() : '',
        },
      };
      await Client(exporterApiClient, Endpoints.GLOBALCONFIG.PATCH.path, {
        method: Endpoints.GLOBALCONFIG.PATCH.method,
        data: patch,
      });
      message.success(C.MESSAGES.SAVE_SUCCESS);
    } catch (e) {
      message.error(getFriendlyValidationError(e) || C.MESSAGES.SAVE_FAILED);
    } finally {
      setSubmitting(false);
    }
  }, [aiEnabled, apiKey, canEnable, provider, requiresKey]);

  const saveExcludedNamespaces = useCallback(async () => {
    setNamespacesSaving(true);
    try {
      await Client(exporterApiClient, Endpoints.GLOBALCONFIG.PATCH.path, {
        method: Endpoints.GLOBALCONFIG.PATCH.method,
        data: { excludedNamespaces },
      });
      message.success(C.MESSAGES.NAMESPACES_SAVE_SUCCESS);
      dispatch(fetchGlobalConfigThunk());
    } catch (e) {
      message.error(getFriendlyValidationError(e) || C.MESSAGES.NAMESPACES_SAVE_FAILED);
    } finally {
      setNamespacesSaving(false);
    }
  }, [dispatch, excludedNamespaces]);

  const saveFetchInterval = useCallback(async () => {
    const minutes = Number(fetchIntervalMinutes);
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    setSavingInterval(true);
    try {
      await Client(exporterApiClient, Endpoints.GLOBALCONFIG.PATCH.path, {
        method: Endpoints.GLOBALCONFIG.PATCH.method,
        data: { userSettings: { fetchIntervalSeconds: Math.round(minutes * 60) } },
      });
      message.success(C.MESSAGES.PLATFORM_SAVE_INTERVAL_SUCCESS);
      dispatch(fetchGlobalConfigThunk());
    } catch (e) {
      message.error(getFriendlyValidationError(e) || C.MESSAGES.PLATFORM_SAVE_INTERVAL_FAILED);
    } finally {
      setSavingInterval(false);
    }
  }, [dispatch, fetchIntervalMinutes]);

  const saveSnapshotsMax = useCallback(async () => {
    const v = Number(snapshotsMaxPerApp);
    if (!Number.isFinite(v) || v <= 0) return;
    setSavingSnapshots(true);
    try {
      await Client(exporterApiClient, Endpoints.GLOBALCONFIG.PATCH.path, {
        method: Endpoints.GLOBALCONFIG.PATCH.method,
        data: { snapshots: { maxPerApp: Math.round(v) } },
      });
      message.success(C.MESSAGES.PLATFORM_SAVE_SNAPSHOTS_SUCCESS);
      dispatch(fetchGlobalConfigThunk());
    } catch (e) {
      message.error(getFriendlyValidationError(e) || C.MESSAGES.PLATFORM_SAVE_SNAPSHOTS_FAILED);
    } finally {
      setSavingSnapshots(false);
    }
  }, [dispatch, snapshotsMaxPerApp]);

  const onProviderChange = useCallback((next: ProviderKey) => {
    setProvider(next);
    setApiKey('');
    setIsKeyValid(false);
    setValidationReason(null);
    setLastValidatedKey('');
  }, []);

  const validateDisabled = useMemo(() => {
    const trimmed = apiKey.trim();
    if (!trimmed) return true;
    // Keep Validate disabled as long as the input matches the last validated/saved key.
    if (lastValidatedKey.length > 0 && trimmed === lastValidatedKey) return true;
    return false;
  }, [apiKey, lastValidatedKey]);

  return (
    <>
      <SettingsCard
        title={C.LABELS.AI_INSIGHTS_TITLE}
        description={C.LABELS.AI_INSIGHTS_DESCRIPTION}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700 }}>{C.LABELS.ENABLE_AI_LABEL}</div>
          <Switch checked={aiEnabled} onChange={setAIEnabled} />
        </div>
      </SettingsCard>

      {aiEnabled ? (
        <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
          <SettingsCard
            title={C.LABELS.PROVIDER_CARD_TITLE}
            description={C.LABELS.PROVIDER_CARD_DESCRIPTION}
          >
            <div style={{ display: 'grid', rowGap: 10 }}>
              <Select
                value={provider}
                options={[...C.PROVIDERS.OPTIONS]}
                style={{ width: '100%' }}
                onChange={onProviderChange}
              />

              {requiresKey && (
                <div style={{ display: 'grid', rowGap: 8 }}>
                  <Input.Password
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setIsKeyValid(false);
                      setValidationReason(null);
                    }}
                    placeholder={C.LABELS.API_KEY_PLACEHOLDER}
                  />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Button onClick={validateKey} loading={validating} disabled={validateDisabled}>
                      {C.LABELS.VALIDATE_BUTTON}
                    </Button>
                  </div>
                  {validationReason && (
                    <div style={{ fontSize: 12, color: C.COLORS.ERROR_TEXT }}>
                      {validationReason}
                    </div>
                  )}
                  {isKeyValid && !validationReason && (
                    <div style={{ fontSize: 12, color: C.COLORS.SUCCESS_TEXT }}>
                      {C.LABELS.KEY_VALID}
                    </div>
                  )}
                </div>
              )}
            </div>
          </SettingsCard>
        </div>
      ) : null}

      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard title={C.LABELS.NAMESPACES_TITLE} description={C.LABELS.NAMESPACES_DESCRIPTION}>
          <div style={{ display: 'grid', rowGap: 10 }}>
            <Select
              mode="multiple"
              value={excludedNamespaces}
              placeholder={C.LABELS.NAMESPACES_SELECTOR_PLACEHOLDER}
              options={namespaceOptions.map((n) => ({ value: n, label: n }))}
              style={{ width: '100%' }}
              loading={namespacesLoading}
              onChange={(vals) => setExcludedNamespaces(vals.map((v) => String(v)))}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                onClick={saveExcludedNamespaces}
                loading={namespacesSaving}
                style={{ background: DEFAULT_COLORS.SUCCESS, borderColor: DEFAULT_COLORS.SUCCESS }}
              >
                {C.LABELS.NAMESPACES_SAVE_BUTTON}
              </Button>
            </div>
          </div>
        </SettingsCard>
      </div>

      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard title={C.LABELS.PLATFORM_TITLE} description={C.LABELS.PLATFORM_DESCRIPTION}>
          <div style={{ display: 'grid', rowGap: 12 }}>
            <div style={{ display: 'grid', rowGap: 6 }}>
              <div style={{ fontWeight: 700 }}>{C.LABELS.FETCH_INTERVAL_MINUTES_LABEL}</div>
              <Input
                value={String(fetchIntervalMinutes)}
                inputMode="numeric"
                onChange={(e) => setFetchIntervalMinutes(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  onClick={saveFetchInterval}
                  loading={savingInterval}
                  style={{ background: DEFAULT_COLORS.SUCCESS, borderColor: DEFAULT_COLORS.SUCCESS }}
                >
                  {C.LABELS.PLATFORM_SAVE_INTERVAL_BUTTON}
                </Button>
              </div>
            </div>

            <div style={{ display: 'grid', rowGap: 6 }}>
              <div style={{ fontWeight: 700 }}>{C.LABELS.SNAPSHOTS_MAX_PER_APP_LABEL}</div>
              <Input
                value={String(snapshotsMaxPerApp)}
                inputMode="numeric"
                onChange={(e) => setSnapshotsMaxPerApp(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  onClick={saveSnapshotsMax}
                  loading={savingSnapshots}
                  style={{ background: DEFAULT_COLORS.SUCCESS, borderColor: DEFAULT_COLORS.SUCCESS }}
                >
                  {C.LABELS.PLATFORM_SAVE_SNAPSHOTS_BUTTON}
                </Button>
              </div>
            </div>
          </div>
        </SettingsCard>
      </div>

      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard title={C.LABELS.SAVE_TITLE} description={C.LABELS.SAVE_DESCRIPTION}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              onClick={handleEnable}
              loading={submitting}
              disabled={requiresKey && aiEnabled && !isKeyValid}
              style={{
                background: DEFAULT_COLORS.SUCCESS,
                borderColor: DEFAULT_COLORS.SUCCESS,
              }}
            >
              {C.LABELS.ENABLE_BUTTON}
            </Button>
          </div>
        </SettingsCard>
      </div>
    </>
  );
});

AIDataSectionContent.displayName = 'AIDataSectionContent';

export default AIDataSectionContent;
