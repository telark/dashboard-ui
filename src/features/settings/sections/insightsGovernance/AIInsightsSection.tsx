import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, message } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { Client, enrichmentApiClient, exporterApiClient } from '../../../../api';
import { Endpoints, DEFAULT_COLORS } from '../../../../constants';
import { Switch } from '../../../../components/display/inputs';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch } from '../../../../store';
import { INSIGHTS_GOVERNANCE_CONSTANTS as C, ProviderKey } from './constants';

type ValidationApiResponse = { ok: boolean; reason?: string };

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

const AIInsightsSection: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);

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

  const [initialAi, setInitialAi] = useState<{
    enabled: boolean;
    provider: ProviderKey;
    apiKey: string;
  } | null>(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [provider, setProvider] = useState<ProviderKey>(C.PROVIDERS.DEFAULT);
  const [apiKey, setApiKey] = useState('');
  const [lastValidatedKey, setLastValidatedKey] = useState<string | null>(null);
  const [validMessage, setValidMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);

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
    setInitialAi({ enabled, provider: normalizedProvider, apiKey: key });
  }, [globalConfig?.data]);

  const aiHasChanges = useMemo(() => {
    if (!initialAi) return false;
    if (aiEnabled !== initialAi.enabled) return true;
    if (!aiEnabled && !initialAi.enabled) return false;
    if (provider !== initialAi.provider) return true;
    return apiKey !== initialAi.apiKey;
  }, [aiEnabled, apiKey, initialAi, provider]);

  const validateDisabled = useMemo(() => {
    const trimmed = apiKey.trim();
    if (!trimmed) return true;
    return Boolean(lastValidatedKey && trimmed === lastValidatedKey);
  }, [apiKey, lastValidatedKey]);

  const canEnable = useMemo(() => {
    if (!aiEnabled) return true;
    if (provider === 'ollama') return true;
    const trimmed = apiKey.trim();
    return Boolean(trimmed && trimmed === lastValidatedKey);
  }, [aiEnabled, apiKey, lastValidatedKey, provider]);

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
        data: { provider, api_key: trimmed },
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
    const apiKeyForSave = provider === 'ollama' ? '' : apiKey.trim();
    try {
      const { path, method } = Endpoints.GLOBALCONFIG.PATCH;
      await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path, {
        method,
        data: { ai: { enabled: aiEnabled, provider, apiKey: apiKeyForSave } },
      });
      message.success(C.MESSAGES.SAVE_SUCCESS);
      setInitialAi({ enabled: aiEnabled, provider, apiKey: apiKeyForSave });
      dispatch(fetchGlobalConfigThunk());
    } catch (err: unknown) {
      message.error(getFriendlyValidationError(err) || C.MESSAGES.SAVE_FAILED);
    } finally {
      setSaving(false);
    }
  }, [aiEnabled, apiKey, dispatch, provider]);

  return (
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
            {provider !== 'ollama' ? (
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
            ) : null}

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
            style={saveButtonStyle(!aiHasChanges || !canEnable)}
          >
            Save
          </Button>
        </div>
      </div>
    </SettingsCard>
  );
});

AIInsightsSection.displayName = 'AIInsightsSection';

export default AIInsightsSection;
