import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { App as AntdApp, Button, Input, Progress, Select, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import SettingsCard from '../../components/SettingsCard';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import RowTag from '../../../../components/display/table/RowTag';
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

// The Check button sizes column 2 so the select keeps the remaining width.
const AI_FIELD_GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  columnGap: C.LAYOUT.FIELD_COLUMN_GAP,
  alignItems: 'center',
};

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
  const { runtime, isLoading } = useAnalyzerRuntime();

  const [initialAi, setInitialAi] = useState<AiForm | null>(null);
  const [form, setForm] = useState<AiForm>({
    enabled: false,
    model: C.MODELS.DEFAULT,
    autoAnalyze: false,
  });
  const [search, setSearch] = useState('');
  const [check, setCheck] = useState<ModelCheck | null>(null);
  const [checking, setChecking] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!globalConfig?.data) return;
    const ai = globalConfig.data.ai;
    const next: AiForm = {
      enabled: Boolean(ai?.enabled),
      model: ai?.model?.trim() || C.MODELS.DEFAULT,
      autoAnalyze: Boolean(ai?.autoAnalyze),
    };
    setForm(next);
    setInitialAi(next);
  }, [globalConfig?.data]);

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
  const pullPercent = pull && pull.total > 0 ? Math.floor((pull.completed * 100) / pull.total) : 0;

  const hasChanges =
    initialAi !== null &&
    (form.enabled !== initialAi.enabled ||
      form.model !== initialAi.model ||
      form.autoAnalyze !== initialAi.autoAnalyze);

  const modelOptions = useMemo(() => {
    const typed = search.trim();
    const values = new Set<string>(C.MODELS.OPTIONS.map((o) => o.value));
    values.add(form.model);
    if (C.MODELS.NAME_PATTERN.test(typed)) values.add(typed);
    return [...values].map((value) => {
      const license =
        (check?.model === value && check.license) ||
        C.MODELS.OPTIONS.find((o) => o.value === value)?.license;
      return { value, label: license ? `${value} · ${license}` : value };
    });
  }, [check, form.model, search]);

  const onModelChange = useCallback((model: string) => {
    setForm((prev) => ({ ...prev, model }));
    setSearch('');
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
    } catch (error: unknown) {
      logger.error(C.MESSAGES.SAVE_FAILED, error);
      // A 4xx names the invalid fields; network and 5xx keep the generic text.
      const meta = (error as ExtendedAxiosError).normalized;
      message.error(meta?.isClient ? meta.message : C.MESSAGES.SAVE_FAILED);
    } finally {
      setSaving(false);
    }
  }, [dispatch, form, message]);

  const deniedTooltip = canControlAiInsights
    ? undefined
    : C.LABELS.CONTROL_AI_INSIGHTS_PERMISSION_DENIED;

  const installToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: 'install',
          label: C.LABELS.INSTALL_MODEL_BUTTON,
          variant: 'default',
          loading: installing,
          onClick: installModel,
        },
      ],
    }),
    [installing, installModel],
  );

  const checkToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: 'check',
          label: C.LABELS.VALIDATE_BUTTON,
          variant: 'default',
          loading: checking,
          disabled: !modelValid || !canControlAiInsights,
          tooltip: deniedTooltip,
          onClick: checkModel,
        },
      ],
    }),
    [checking, modelValid, canControlAiInsights, deniedTooltip, checkModel],
  );

  const saveToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: 'save',
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
        title={C.LABELS.RUNTIME_STATUS_TITLE}
        titleBadge={
          <RowTag
            text={C.LABELS.EXPERIMENTAL_BADGE}
            accent={DEFAULT_COLORS.WARNING}
            fontSize={11}
          />
        }
      >
        <div style={COLUMN}>
          {isLoading ? null : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontWeight: 700,
                  color: ready ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.WARNING,
                }}
              >
                {stateLabel}
              </span>
              {runtime?.reason ? (
                <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{runtime.reason}</span>
              ) : null}
            </div>
          )}
          {runtime ? (
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
              {C.LABELS.RUNTIME_MODE_TITLE}: {C.LABELS.MODE_LABELS[runtime.mode]}
            </div>
          ) : null}

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

          {pull ? (
            <div>
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{pull.model}</div>
              <Progress percent={pullPercent} />
            </div>
          ) : null}

          {modelMissing && airGapped ? (
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{C.LABELS.AIR_GAPPED_HINT}</div>
          ) : null}
          {modelMissing && !airGapped ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Toolbar config={installToolbarConfig} />
            </div>
          ) : null}
        </div>
      </SettingsCard>

      <SettingsCard title={C.LABELS.MODEL_LABEL} description={modelHint}>
        <div style={COLUMN}>
          <div style={AI_FIELD_GRID}>
            <Select
              value={form.model}
              options={modelOptions}
              onChange={onModelChange}
              showSearch={{ onSearch: setSearch }}
              allowClear={false}
              disabled={!canControlAiInsights}
              style={{ width: '100%' }}
            />
            <Toolbar config={checkToolbarConfig} />
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
        </div>
      </SettingsCard>

      <SettingsCard
        title={C.LABELS.AI_INSIGHTS_TITLE}
        description={C.LABELS.AI_INSIGHTS_DESCRIPTION}
      >
        <div style={COLUMN}>
          <div style={TOGGLE_ROW}>
            <div style={{ fontWeight: 700 }}>{C.LABELS.ENABLE_AI_LABEL}</div>
            <Switch
              checked={form.enabled}
              onChange={(enabled) => setForm((prev) => ({ ...prev, enabled }))}
              disabled={!canControlAiInsights || enableBlocked}
              tooltip={deniedTooltip ?? (enableBlocked ? stateLabel : undefined)}
            />
          </div>
          <div style={TOGGLE_ROW}>
            <div style={{ fontWeight: 700 }}>{C.LABELS.AUTO_ANALYZE_LABEL}</div>
            <Switch
              checked={form.autoAnalyze}
              onChange={(autoAnalyze) => setForm((prev) => ({ ...prev, autoAnalyze }))}
              disabled={!canControlAiInsights}
              tooltip={deniedTooltip}
            />
          </div>
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
