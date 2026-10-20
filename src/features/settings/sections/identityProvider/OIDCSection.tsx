import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Input, Tooltip, Typography, App as AntdApp } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import {
  SettingsDivider,
  SettingsField,
  SettingsFieldLabel,
  SettingsSubsectionHeader,
} from '../../components/SettingsFields';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import { Client, authApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import { Switch } from '../../../../components/display/inputs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch } from '../../../../store';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import { SETTINGS_CONSTANTS } from '../../constants';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';
import { useSignInSettingsAccess } from './useSignInSettingsAccess';
import GoogleSetupHelp from './GoogleSetupHelp';

interface OIDCForm {
  enabled: boolean;
  googleClientID: string;
  egressAllowed: boolean;
  googleJwkJson: string;
}

const EMPTY_FORM: OIDCForm = {
  enabled: false,
  googleClientID: '',
  egressAllowed: true,
  googleJwkJson: '',
};

const trimmed = (form: OIDCForm): OIDCForm => ({
  enabled: form.enabled,
  googleClientID: form.googleClientID.trim(),
  egressAllowed: form.egressAllowed,
  googleJwkJson: form.googleJwkJson.trim(),
});

interface OIDCErrors {
  clientId?: string;
  keys?: string;
}

// Mirrors the server's own check so the admin sees the problem before saving. The
// server still re-checks: this is convenience, not a trust boundary. The key set is
// checked only while its field shows, so no error is ever hidden.
function validate(form: OIDCForm, hasPinnedKeys: boolean): OIDCErrors {
  if (!form.enabled) return {};
  const errors: OIDCErrors = {};
  if (!form.googleClientID.trim()) errors.clientId = C.MESSAGES.CLIENT_ID_REQUIRED;
  if (form.egressAllowed) return errors;
  if (!form.googleJwkJson.trim()) {
    if (!hasPinnedKeys) errors.keys = C.MESSAGES.TRUST_SOURCE_REQUIRED;
    return errors;
  }
  try {
    JSON.parse(form.googleJwkJson);
  } catch {
    errors.keys = C.MESSAGES.JWK_INVALID;
  }
  return errors;
}

// Like the plan form's parameter errors: red text right under the field.
const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <Typography.Text type="danger" style={{ fontSize: SETTINGS_CONSTANTS.CONTENT.HINT_FONT_SIZE }}>
      {message}
    </Typography.Text>
  ) : null;

const OIDCSection: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const { canEdit, deniedTooltip, bootstrapOnly } = useSignInSettingsAccess();
  const { message } = AntdApp.useApp();

  const [form, setForm] = useState<OIDCForm>(EMPTY_FORM);
  const [initial, setInitial] = useState<OIDCForm | null>(null);
  const [saving, setSaving] = useState(false);
  const hasPinnedKeys = Boolean(globalConfig?.data?.oidc?.googleJwkJson);

  const configData = globalConfig?.data;
  const [loadedFrom, setLoadedFrom] = useState(configData);
  // Loaded while rendering (React's derived-state pattern), so no effect re-renders the section.
  if (configData && (configData !== loadedFrom || !initial)) {
    const oidc = configData.oidc;
    const loaded: OIDCForm = {
      enabled: Boolean(oidc?.enabled),
      googleClientID: String(oidc?.googleClientID ?? ''),
      egressAllowed: oidc?.egressAllowed ?? EMPTY_FORM.egressAllowed,
      // The stored set goes stale, so it is never shown: the field only takes a new one.
      googleJwkJson: EMPTY_FORM.googleJwkJson,
    };
    setLoadedFrom(configData);
    setForm(loaded);
    setInitial(loaded);
  }

  useEffect(() => {
    dispatch(fetchGlobalConfigThunk());
  }, [dispatch]);

  const errors = useMemo(() => validate(form, hasPinnedKeys), [form, hasPinnedKeys]);
  const hasErrors = Boolean(errors.clientId || errors.keys);

  const hasChanges = useMemo(() => {
    if (!initial) return false;
    const a = trimmed(form);
    const b = trimmed(initial);
    return (
      a.enabled !== b.enabled ||
      a.googleClientID !== b.googleClientID ||
      a.egressAllowed !== b.egressAllowed ||
      a.googleJwkJson !== b.googleJwkJson
    );
  }, [form, initial]);

  const update = useCallback(<K extends keyof OIDCForm>(key: K, value: OIDCForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    const payload = trimmed(form);
    // Left out, the key keeps the pinned set; an empty string would clear it.
    const { googleJwkJson, ...keepPinned } = payload;
    setSaving(true);
    try {
      const { path, method } = Endpoints.AUTH.OIDC.CONFIG;
      const data = googleJwkJson ? payload : keepPinned;
      await Client<unknown>(authApiClient, path, { method, data });
      message.success(C.MESSAGES.SAVE_SUCCESS);
      setInitial(payload);
      dispatch(fetchGlobalConfigThunk());
    } catch (err: unknown) {
      message.error(extractErrorMessage(err, C.MESSAGES.SAVE_FAILED));
    } finally {
      setSaving(false);
    }
  }, [form, dispatch, message]);

  const saveToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: SETTINGS_CONSTANTS.TOOLBAR.SAVE_KEY,
          label: C.LABELS.SAVE_BUTTON,
          variant: 'primary',
          loading: saving,
          disabled: !hasChanges || hasErrors || !canEdit,
          tooltip: deniedTooltip,
          onClick: handleSave,
        },
      ],
    }),
    [saving, hasChanges, hasErrors, canEdit, deniedTooltip, handleSave],
  );

  return (
    <SettingsCard title={C.LABELS.CARD_TITLE} description={C.LABELS.CARD_DESCRIPTION}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: C.LAYOUT.FIELD_GAP }}>
        {bootstrapOnly ? (
          <Alert type="info" showIcon title={C.LABELS.BOOTSTRAP_ONLY_NOTICE} />
        ) : null}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: C.LAYOUT.ROW_GAP,
          }}
        >
          <div style={{ fontWeight: 700 }}>{C.LABELS.ENABLE_LABEL}</div>
          <Tooltip title={deniedTooltip}>
            <span style={canEdit ? {} : { display: 'inline-block', cursor: 'not-allowed' }}>
              <Switch
                checked={form.enabled}
                onChange={canEdit ? (v: boolean) => update('enabled', v) : undefined}
                disabled={!canEdit}
              />
            </span>
          </Tooltip>
        </div>

        {form.enabled ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: C.LAYOUT.FIELD_GAP }}>
            <SettingsDivider />
            <GoogleSetupHelp />
            <SettingsField label={C.LABELS.CLIENT_ID_LABEL}>
              <Input
                placeholder={C.LABELS.CLIENT_ID_PLACEHOLDER}
                value={
                  canEdit || !form.googleClientID
                    ? form.googleClientID
                    : C.LABELS.CLIENT_ID_REDACTED
                }
                disabled={!canEdit}
                status={errors.clientId ? 'error' : undefined}
                onChange={(e) => update('googleClientID', e.target.value)}
              />
              <FieldError message={errors.clientId} />
            </SettingsField>

            <SettingsDivider />
            <SettingsSubsectionHeader title={C.SETUP.KEYS_TITLE} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: C.LAYOUT.ROW_GAP,
              }}
            >
              <SettingsFieldLabel label={C.LABELS.EGRESS_LABEL} info={C.LABELS.EGRESS_HINT} />
              <Switch
                checked={form.egressAllowed}
                onChange={canEdit ? (v: boolean) => update('egressAllowed', v) : undefined}
                disabled={!canEdit}
                tooltip={deniedTooltip}
              />
            </div>

            {!form.egressAllowed ? (
              <SettingsField
                label={C.LABELS.JWK_LABEL}
                hint={
                  <>
                    {C.LABELS.JWK_SOURCE_HINT}{' '}
                    <a href={C.LINKS.JWKS_URL} target="_blank" rel="noreferrer">
                      {C.LINKS.JWKS_URL}
                    </a>
                    {C.LABELS.JWK_SOURCE_HINT_END}
                    {hasPinnedKeys ? ` ${C.LABELS.JWK_KEEP_HINT}` : null}
                  </>
                }
              >
                <Input.TextArea
                  placeholder={C.LABELS.JWK_PLACEHOLDER}
                  value={form.googleJwkJson}
                  disabled={!canEdit}
                  rows={C.LAYOUT.JWK_ROWS}
                  status={errors.keys ? 'error' : undefined}
                  onChange={(e) => update('googleJwkJson', e.target.value)}
                />
                <FieldError message={errors.keys} />
              </SettingsField>
            ) : null}
          </div>
        ) : null}

        <SettingsDivider />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Toolbar config={saveToolbarConfig} />
        </div>
      </div>
    </SettingsCard>
  );
});

OIDCSection.displayName = 'OIDCSection';

export default OIDCSection;
