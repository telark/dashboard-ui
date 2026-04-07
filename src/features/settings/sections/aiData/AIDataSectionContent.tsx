import React, { memo, useCallback, useMemo, useState } from 'react';
import { Button, Input, Select, Switch, message } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import { Client, enrichmentApiClient, exporterApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';

type ProviderKey = 'ollama' | 'gemini' | 'grok' | 'claude' | 'chatgpt';

const PROVIDER_OPTIONS: { value: ProviderKey; label: string }[] = [
  { value: 'ollama', label: 'Ollama' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'grok', label: 'Grok' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
];

const { CONTENT } = SETTINGS_CONSTANTS;

const AIDataSectionContent: React.FC = memo(() => {
  const [aiEnabled, setAIEnabled] = useState(false);
  const [provider, setProvider] = useState<ProviderKey>('ollama');
  const [apiKey, setApiKey] = useState('');
  const [validating, setValidating] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [validationReason, setValidationReason] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const requiresKey = provider !== 'ollama';

  const canEnable = useMemo(() => {
    if (!aiEnabled) return true;
    if (!requiresKey) return true;
    return isKeyValid;
  }, [aiEnabled, isKeyValid, requiresKey]);

  const validateKey = useCallback(async () => {
    if (!requiresKey) {
      setIsKeyValid(true);
      setValidationReason(null);
      return;
    }
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setIsKeyValid(false);
      setValidationReason('API key is required.');
      return;
    }
    setValidating(true);
    setIsKeyValid(false);
    setValidationReason(null);
    try {
      const resp = await Client<{ ok: boolean; reason?: string }>(
        enrichmentApiClient,
        'provider/validate-api-key',
        {
          method: 'POST',
          data: { provider, api_key: trimmed },
        },
      );
      if (resp?.ok) {
        setIsKeyValid(true);
        setValidationReason(null);
        message.success('API key validated.');
      } else {
        setIsKeyValid(false);
        const reason = resp?.reason || 'Validation failed.';
        setValidationReason(reason);
        message.error(reason);
      }
    } catch (e) {
      setIsKeyValid(false);
      setValidationReason('Validation failed.');
      message.error('Validation failed.');
      throw e;
    } finally {
      setValidating(false);
    }
  }, [apiKey, provider, requiresKey]);

  const handleEnable = useCallback(async () => {
    if (!canEnable) return;
    setSubmitting(true);
    try {
      const patch = {
        spec: {
          ai: {
            enabled: aiEnabled,
            provider,
            apiKey: requiresKey ? apiKey.trim() : '',
          },
        },
      };
      await Client(exporterApiClient, Endpoints.GLOBALCONFIG.PATCH.path, {
        method: Endpoints.GLOBALCONFIG.PATCH.method,
        data: patch,
      });
      message.success('Settings saved.');
    } catch {
      message.error('Failed to save settings.');
    } finally {
      setSubmitting(false);
    }
  }, [aiEnabled, apiKey, canEnable, provider, requiresKey]);

  const onProviderChange = useCallback((next: ProviderKey) => {
    setProvider(next);
    setApiKey('');
    setIsKeyValid(false);
    setValidationReason(null);
  }, []);

  return (
    <>
      <SettingsCard
        title="AI Insights"
        description="Enable AI enrichment and validate provider keys."
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700 }}>Enable AI insights</div>
          <Switch checked={aiEnabled} onChange={setAIEnabled} />
        </div>
      </SettingsCard>

      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard title="Provider" description="Choose your AI provider.">
          <div style={{ display: 'grid', rowGap: 10 }}>
            <Select
              value={provider}
              options={PROVIDER_OPTIONS}
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
                  placeholder="API key"
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <Button onClick={validateKey} loading={validating} disabled={!apiKey.trim()}>
                    Validate
                  </Button>
                </div>
                {validationReason && (
                  <div style={{ fontSize: 12, color: '#b91c1c' }}>{validationReason}</div>
                )}
                {isKeyValid && !validationReason && (
                  <div style={{ fontSize: 12, color: '#15803d' }}>Key is valid.</div>
                )}
              </div>
            )}
          </div>
        </SettingsCard>
      </div>

      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard title="Save" description="Apply changes to the cluster-wide GlobalConfig.">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              onClick={handleEnable}
              loading={submitting}
              disabled={requiresKey && aiEnabled && !isKeyValid}
            >
              Enable
            </Button>
          </div>
        </SettingsCard>
      </div>
    </>
  );
});

AIDataSectionContent.displayName = 'AIDataSectionContent';

export default AIDataSectionContent;
