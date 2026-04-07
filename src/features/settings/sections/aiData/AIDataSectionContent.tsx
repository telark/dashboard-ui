import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, message } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import { Client, enrichmentApiClient, exporterApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import { AI_DATA_CONSTANTS as C, ProviderKey } from './constants';
import { DEFAULT_COLORS } from '../../../../constants';
import { Switch } from '../../../../components/display/inputs';

const { CONTENT } = SETTINGS_CONSTANTS;

type ValidationApiResponse = { ok: boolean; reason?: string };
type GlobalConfigResponse = { ai?: { enabled?: boolean; provider?: unknown; apiKey?: unknown } };

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
  const [aiEnabled, setAIEnabled] = useState(false);
  const [provider, setProvider] = useState<ProviderKey>(C.PROVIDERS.DEFAULT);
  const [apiKey, setApiKey] = useState('');
  const [validating, setValidating] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [validationReason, setValidationReason] = useState<string | null>(null);
  const [lastValidatedKey, setLastValidatedKey] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const normalizeProvider = useCallback((raw: unknown): ProviderKey => {
    const val = String(raw || '').trim().toLowerCase();
    const allowed = C.PROVIDERS.OPTIONS.map((o) => o.value);
    return (allowed.includes(val as ProviderKey) ? (val as ProviderKey) : C.PROVIDERS.DEFAULT);
  }, []);

  const loadFromGlobalConfig = useCallback(async () => {
    try {
      const resp = await Client<{ data: GlobalConfigResponse }>(
        exporterApiClient,
        Endpoints.GLOBALCONFIG.GET.path,
        { method: Endpoints.GLOBALCONFIG.GET.method },
      );
      const ai = resp?.data?.ai;
      if (!ai || typeof ai !== 'object') return;

      const hydratedEnabled = Boolean(ai.enabled);
      const hydratedProvider = normalizeProvider(ai.provider);
      const key = typeof ai.apiKey === 'string' ? ai.apiKey.trim() : '';
      const hydratedRequiresKey = hydratedProvider !== C.PROVIDERS.DEFAULT;

      setAIEnabled(hydratedEnabled);
      setProvider(hydratedProvider);
      setApiKey(key);

      setValidationReason(null);
      setLastValidatedKey(key);
      setIsKeyValid(!hydratedRequiresKey || key.length > 0);
    } catch (e) {
      message.error(getFriendlyValidationError(e));
    }
  }, [normalizeProvider]);

  useEffect(() => {
    void loadFromGlobalConfig();
  }, [loadFromGlobalConfig]);

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
