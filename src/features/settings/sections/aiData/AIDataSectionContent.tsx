import React, { memo, useCallback, useMemo, useState } from 'react';
import { Button, Input, Select, Switch, message } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import { Client, enrichmentApiClient, exporterApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import { AI_DATA_CONSTANTS as C, ProviderKey } from './constants';

const { CONTENT } = SETTINGS_CONSTANTS;

const AIDataSectionContent: React.FC = memo(() => {
  const [aiEnabled, setAIEnabled] = useState(false);
  const [provider, setProvider] = useState<ProviderKey>(C.PROVIDERS.DEFAULT);
  const [apiKey, setApiKey] = useState('');
  const [validating, setValidating] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [validationReason, setValidationReason] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const requiresKey = provider !== C.PROVIDERS.DEFAULT;

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
      setValidationReason(C.MESSAGES.API_KEY_REQUIRED);
      return;
    }
    setValidating(true);
    setIsKeyValid(false);
    setValidationReason(null);
    try {
      const resp = await Client<{ ok: boolean; reason?: string }>(
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
        message.success(C.MESSAGES.VALIDATION_SUCCESS);
      } else {
        setIsKeyValid(false);
        const reason = resp?.reason || C.MESSAGES.VALIDATION_FAILED;
        setValidationReason(reason);
        message.error(reason);
      }
    } catch (e) {
      setIsKeyValid(false);
      setValidationReason(C.MESSAGES.VALIDATION_FAILED);
      message.error(C.MESSAGES.VALIDATION_FAILED);
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
      message.success(C.MESSAGES.SAVE_SUCCESS);
    } catch {
      message.error(C.MESSAGES.SAVE_FAILED);
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
        title={C.LABELS.AI_INSIGHTS_TITLE}
        description={C.LABELS.AI_INSIGHTS_DESCRIPTION}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700 }}>{C.LABELS.ENABLE_AI_LABEL}</div>
          <Switch checked={aiEnabled} onChange={setAIEnabled} />
        </div>
      </SettingsCard>

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
                  <Button onClick={validateKey} loading={validating} disabled={!apiKey.trim()}>
                    {C.LABELS.VALIDATE_BUTTON}
                  </Button>
                </div>
                {validationReason && (
                  <div style={{ fontSize: 12, color: C.COLORS.ERROR_TEXT }}>{validationReason}</div>
                )}
                {isKeyValid && !validationReason && (
                  <div style={{ fontSize: 12, color: C.COLORS.SUCCESS_TEXT }}>{C.LABELS.KEY_VALID}</div>
                )}
              </div>
            )}
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
