import React, { memo, useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { App as AntdApp, Button, Input, Progress, Select, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import SettingsCard from '../../components/SettingsCard';
import {
  SettingsDetails,
  SettingsDivider,
  SettingsField,
  SettingsFieldLabel,
  SettingsSubsectionHeader,
} from '../../components/SettingsFields';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import { Switch } from '../../../../components/display/inputs';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { ExtendedAxiosError } from '../../../../api/client/normalize';
import { Client, exporterApiClient } from '../../../../api';
import { Endpoints, DEFAULT_COLORS } from '../../../../constants';
import logger from '../../../../logging';
import type { AppDispatch } from '../../../../store';
import { fetchGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import {
  ACTION_PERMISSIONS,
  usePermission,
} from '../../../auth/hooks/permissions/permissionEngine';
import {
  apiErrorCode,
  INSIGHT_ERROR_CODES,
  INSIGHT_ERROR_MESSAGES,
  pullAnalyzerModel,
  useAnalyzerRuntime,
  validateAnalyzerModel,
} from '../../../insights';
import type { ValidateModelResponse } from '../../../insights';
import { SETTINGS_CONSTANTS } from '../../constants';
import { INSIGHTS_GOVERNANCE_CONSTANTS as C } from './constants';

const CONTROL_AI_PERMISSION = ACTION_PERMISSIONS.settings.controlAiInsights;

interface AiForm {
  enabled: boolean;
  model: string;
  autoAnalyze: boolean;
}

type ValidateError = Partial<ValidateModelResponse> & { code?: string };

interface ModelCheck {
  model: string;
  ok: boolean;
  text: string;
  code?: string;
  license?: string;
  warning?: string;
}

const CHECK_ERROR_TEXT: Record<string, string> = {
  model_lacks_tools: C.MESSAGES.MODEL_LACKS_TOOLS,
  [INSIGHT_ERROR_CODES.MODEL_NOT_INSTALLED]: C.MESSAGES.MODEL_NOT_INSTALLED,
  invalid_model_name: C.MESSAGES.INVALID_MODEL_NAME,
};

const checkErrorText = (code?: string): string =>
  (code && (CHECK_ERROR_TEXT[code] ?? INSIGHT_ERROR_MESSAGES[code])) || C.MESSAGES.CHECK_FAILED;

// The analyzer answers a failed check with the full ValidateModelResponse plus a code.
const validateErrorData = (error: unknown): ValidateError | undefined =>
  axios.isAxiosError<ResourceDetailsResponse<ValidateError>>(error)
    ? error.response?.data?.data
    : undefined;

const COLUMN: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: C.LAYOUT.FIELD_ROW_GAP,
};

const TOGGLE_ROW: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
  padding: '2px 0',
};

const AIInsightsSection: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const canControlAiInsights = usePermission(
    CONTROL_AI_PERMISSION.scope,
    CONTROL_AI_PERMISSION.level,
    CONTROL_AI_PERMISSION.deny,
  );
  const { message } = AntdApp.useApp();
  const { runtime, isLoading, refresh: refreshRuntime } = useAnalyzerRuntime();

  const [initialAi, setInitialAi] = useState<AiForm | null>(null);
  const [form, setForm] = useState<AiForm>({
    enabled: false,
    model: C.MODELS.DEFAULT,
    autoAnalyze: false,
  });
  const [check, setCheck] = useState<ModelCheck | null>(null);
  const [checking, setChecking] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pullPeak, setPullPeak] = useState({ model: '', percent: 0 });

  // Re-seeds the form when a new config arrives, while rendering (React's derived-state pattern).
  const [seededFrom, setSeededFrom] = useState<unknown>(null);
  if (globalConfig?.data && globalConfig.data !== seededFrom) {
    setSeededFrom(globalConfig.data);
    const ai = globalConfig.data.ai;
    const next: AiForm = {
      enabled: Boolean(ai?.enabled),
      model: ai?.model?.trim() || C.MODELS.DEFAULT,
      autoAnalyze: Boolean(ai?.autoAnalyze),
    };
    setForm(next);
    setInitialAi(next);
  }

  const runtimeState = runtime?.state ?? 'unreachable';
  const stateLabel = C.LABELS.RUNTIME_STATE_LABELS[runtimeState];
  const ready = runtimeState === 'ready';
  const modelValid = C.MODELS.NAME_PATTERN.test(form.model);
  const currentCheck = check?.model === form.model ? check : null;
  const researchLicensed =
    Boolean(currentCheck?.warning) ||
    C.MODELS.OPTIONS.some((o) => o.value === form.model && o.research);
  const modelMissing =
    canControlAiInsights &&
    modelValid &&
    (runtimeState === 'model_missing' ||
      currentCheck?.code === INSIGHT_ERROR_CODES.MODEL_NOT_INSTALLED);
  const airGapped = runtime?.autoPull === false;
  const modelHint = runtime?.mode === 'deep' ? C.LABELS.MODEL_HINT_DEEP : C.LABELS.MODEL_HINT;
  const pull = runtimeState === 'pulling' ? runtime?.pull : undefined;
  const layerPercent = pull && pull.total > 0 ? Math.floor((pull.completed * 100) / pull.total) : 0;

  const hasChanges =
    initialAi !== null &&
    (form.enabled !== initialAi.enabled ||
      form.model !== initialAi.model ||
      form.autoAnalyze !== initialAi.autoAnalyze);

  // Ollama reports each layer from 0 and its last steps without totals: the bar only moves forward.
  // Adjusted while rendering (React's derived-state pattern), so no effect re-renders the section.
  if (pull && (pull.model !== pullPeak.model || layerPercent > pullPeak.percent)) {
    const base = pull.model === pullPeak.model ? pullPeak.percent : 0;
    setPullPeak({ model: pull.model, percent: Math.max(base, layerPercent) });
  }
  const pullPercent = pull?.model === pullPeak.model ? pullPeak.percent : layerPercent;
  const selectedInfo = C.MODELS.OPTIONS.find((o) => o.value === form.model);

  const modelOptions = useMemo(() => {
    // Selection only: the saved model still shows when it is not in the list.
    const values = new Set<string>(C.MODELS.OPTIONS.map((o) => o.value));
    values.add(form.model);
    return [...values].map((value) => {
      const license =
        (check?.model === value && check.license) ||
        C.MODELS.OPTIONS.find((o) => o.value === value)?.license;
      const size = C.MODELS.OPTIONS.find((o) => o.value === value)?.size;
      return { value, label: [value, license, size].filter(Boolean).join(' · ') };
    });
  }, [check, form.model]);

  const onModelChange = useCallback((model: string) => {
    setForm((prev) => ({ ...prev, model }));
  }, []);

  const copyHelmCommand = useCallback(() => {
    globalThis.navigator.clipboard.writeText(C.LABELS.HELM_HINT_COMMAND).then(
      () => message.success(C.MESSAGES.COPIED),
      () => message.error(C.MESSAGES.COPY_FAILED),
    );
  }, [message]);

  const checkModel = useCallback(async () => {
    const { model } = form;
    setChecking(true);
    try {
      const res = await validateAnalyzerModel(model);
      const text = res.ok ? C.MESSAGES.MODEL_VALID : checkErrorText(res.reason);
      setCheck({
        model,
        ok: res.ok,
        text,
        code: res.reason,
        license: res.license,
        warning: res.warning,
      });
      if (res.ok) message.success(C.MESSAGES.MODEL_VALID);
    } catch (error: unknown) {
      const data = validateErrorData(error);
      setCheck({
        model,
        ok: false,
        text: checkErrorText(data?.code),
        code: data?.code,
        license: data?.license,
        warning: data?.warning,
      });
    } finally {
      setChecking(false);
    }
  }, [form, message]);

  const installModel = useCallback(async () => {
    setInstalling(true);
    try {
      await pullAnalyzerModel(form.model);
      setCheck(null);
      message.success(C.MESSAGES.PULL_STARTED);
    } catch (error: unknown) {
      logger.error(C.MESSAGES.PULL_FAILED, error);
      const code = apiErrorCode(error);
      message.error((code && INSIGHT_ERROR_MESSAGES[code]) || C.MESSAGES.PULL_FAILED);
    } finally {
      setInstalling(false);
    }
  }, [form.model, message]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const { path, method } = Endpoints.GLOBALCONFIG.PATCH;
      await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path, {
        method,
        data: { ai: form },
      });
      message.success(C.MESSAGES.SAVE_SUCCESS);
      setInitialAi(form);
      dispatch(fetchGlobalConfigThunk());
      void refreshRuntime();
    } catch (error: unknown) {
      logger.error(C.MESSAGES.SAVE_FAILED, error);
      // A 4xx names the invalid fields; network and 5xx keep the generic text.
      const meta = (error as ExtendedAxiosError).normalized;
      message.error(meta?.isClient ? meta.message : C.MESSAGES.SAVE_FAILED);
    } finally {
      setSaving(false);
    }
  }, [dispatch, form, message, refreshRuntime]);

  const deniedTooltip = canControlAiInsights
    ? undefined
    : C.LABELS.CONTROL_AI_INSIGHTS_PERMISSION_DENIED;

  // Nothing to check when the picked model is the one already running, or it just checked fine.
  const selectedReady = currentCheck?.ok === true || (ready && runtime?.model === form.model);
  const canInstall = modelMissing && !airGapped;

  const modelToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: 'check',
          label: C.LABELS.VALIDATE_BUTTON,
          variant: 'default',
          loading: checking,
          disabled: !modelValid || !canControlAiInsights || selectedReady,
          tooltip: deniedTooltip ?? (selectedReady ? C.LABELS.MODEL_READY_TOOLTIP : undefined),
          onClick: checkModel,
        },
        ...(canInstall
          ? [
              {
                key: 'install',
                label: C.LABELS.INSTALL_MODEL_BUTTON,
                variant: 'primary' as const,
                loading: installing,
                onClick: installModel,
              },
            ]
          : []),
      ],
    }),
    [
      checking,
      modelValid,
      canControlAiInsights,
      selectedReady,
      deniedTooltip,
      checkModel,
      canInstall,
      installing,
      installModel,
    ],
  );

  const saveToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: SETTINGS_CONSTANTS.TOOLBAR.SAVE_KEY,
          label: C.LABELS.SAVE_BUTTON,
          variant: 'primary',
          loading: saving,
          disabled: !hasChanges || !modelValid || !canControlAiInsights,
          tooltip: deniedTooltip,
          onClick: save,
        },
      ],
    }),
    [saving, hasChanges, modelValid, canControlAiInsights, deniedTooltip, save],
  );

  // Turning the analyzer on needs a ready runtime; turning it off never does.
  const enableBlocked = !form.enabled && !ready;

  return (
    <div style={COLUMN}>
      <SettingsCard
        title={C.LABELS.AI_INSIGHTS_TITLE}
        description={C.LABELS.AI_INSIGHTS_DESCRIPTION}
      >
        <div style={COLUMN}>
          <div style={TOGGLE_ROW}>
            <SettingsFieldLabel
              label={C.LABELS.ENABLE_AI_LABEL}
              info={C.LABELS.ENABLE_AI_TOOLTIP}
            />
            <Switch
              checked={form.enabled}
              onChange={(enabled) => setForm((prev) => ({ ...prev, enabled }))}
              disabled={!canControlAiInsights || enableBlocked}
              tooltip={deniedTooltip ?? (enableBlocked ? stateLabel : undefined)}
            />
          </div>
          <div style={TOGGLE_ROW}>
            <SettingsFieldLabel
              label={C.LABELS.AUTO_ANALYZE_LABEL}
              info={C.LABELS.AUTO_ANALYZE_TOOLTIP}
            />
            <Switch
              checked={form.autoAnalyze}
              onChange={(autoAnalyze) => setForm((prev) => ({ ...prev, autoAnalyze }))}
              disabled={!canControlAiInsights}
              tooltip={deniedTooltip}
            />
          </div>
          <SettingsDivider />
          <SettingsSubsectionHeader
            title={C.LABELS.RUNTIME_SECTION_TITLE}
            description={modelHint}
          />
          {isLoading ? null : (
            <SettingsDetails
              items={[
                {
                  label: C.LABELS.RUNTIME_STATUS_TITLE,
                  value: (
                    <>
                      <span
                        style={{
                          fontWeight: 700,
                          color: ready ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.WARNING,
                        }}
                      >
                        {stateLabel}
                      </span>
                      {runtime?.reason ? (
                        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}> {runtime.reason}</span>
                      ) : null}
                    </>
                  ),
                },
                ...(runtime
                  ? [
                      { label: C.LABELS.ACTIVE_MODEL_LABEL, value: runtime.model },
                      {
                        label: C.LABELS.RUNTIME_MODE_TITLE,
                        value: C.LABELS.MODE_LABELS[runtime.mode],
                      },
                    ]
                  : []),
              ]}
            />
          )}

          {runtimeState === 'absent' && !isLoading ? (
            <div style={COLUMN}>
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{C.LABELS.HELM_HINT_TEXT}</div>
              <Space.Compact style={{ width: '100%' }}>
                <Input readOnly value={C.LABELS.HELM_HINT_COMMAND} />
                <Button icon={<CopyOutlined />} onClick={copyHelmCommand}>
                  {C.LABELS.COPY_BUTTON}
                </Button>
              </Space.Compact>
            </div>
          ) : null}

          <div style={COLUMN}>
            <SettingsField label={C.LABELS.MODEL_LABEL}>
              <Select
                value={form.model}
                options={modelOptions}
                onChange={onModelChange}
                allowClear={false}
                disabled={!canControlAiInsights}
                style={{ width: '100%' }}
              />
            </SettingsField>
            {selectedInfo ? (
              <SettingsDetails
                items={[
                  { label: C.LABELS.MODEL_DOWNLOAD_LABEL, value: selectedInfo.size },
                  { label: C.LABELS.MODEL_NEEDS_LABEL, value: selectedInfo.needs },
                  { label: C.LABELS.MODEL_LICENSE_LABEL, value: selectedInfo.license },
                  {
                    label: C.LABELS.MODEL_SOURCE_LABEL,
                    value: (
                      <a
                        href={selectedInfo.source}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: DEFAULT_COLORS.SUCCESS }}
                      >
                        {selectedInfo.source.replace('https://', '')}
                      </a>
                    ),
                  },
                ]}
              />
            ) : null}
          </div>

          {currentCheck ? (
            <div
              style={{
                color: currentCheck.ok ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.DANGER,
                fontWeight: 700,
              }}
            >
              {currentCheck.text}
            </div>
          ) : null}
          {researchLicensed ? (
            <div style={{ color: DEFAULT_COLORS.WARNING }}>{C.LABELS.LICENSE_WARNING}</div>
          ) : null}
          {pull ? (
            <div>
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{pull.model}</div>
              <Progress
                percent={pullPercent}
                status="normal"
                strokeColor={DEFAULT_COLORS.SUCCESS}
                format={(percent) => `${percent ?? 0}%`}
              />
            </div>
          ) : null}
          {modelMissing && airGapped ? (
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{C.LABELS.AIR_GAPPED_HINT}</div>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Toolbar config={modelToolbarConfig} />
          </div>
          <SettingsDivider />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Toolbar config={saveToolbarConfig} />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
});

AIInsightsSection.displayName = 'AIInsightsSection';

export default AIInsightsSection;
