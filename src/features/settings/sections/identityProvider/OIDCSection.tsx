import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Tooltip, App as AntdApp } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import { Client, authApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import { Switch } from '../../../../components/display/inputs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch } from '../../../../store';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';
import { useSignInSettingsAccess } from './useSignInSettingsAccess';

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

// Mirrors the server's own check so the admin sees the problem before saving. The
// server still re-checks: this is convenience, not a trust boundary.
function validate(form: OIDCForm, hasPinnedKeys: boolean): string | null {
  if (!form.enabled) return null;
  if (!form.googleClientID.trim()) return C.MESSAGES.CLIENT_ID_REQUIRED;
  if (!form.egressAllowed && !form.googleJwkJson.trim() && !hasPinnedKeys) {
    return C.MESSAGES.TRUST_SOURCE_REQUIRED;
  }
  if (form.googleJwkJson.trim()) {
    try {
      JSON.parse(form.googleJwkJson);
    } catch {
      return C.MESSAGES.JWK_INVALID;
    }
  }
  return null;
}

const OIDCSection: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const { canEdit, deniedTooltip } = useSignInSettingsAccess();
  const { message } = AntdApp.useApp();

  const [form, setForm] = useState<OIDCForm>(EMPTY_FORM);
  const [initial, setInitial] = useState<OIDCForm | null>(null);
  const [saving, setSaving] = useState(false);
  const hasPinnedKeys = Boolean(globalConfig?.data?.oidc?.googleJwkJson);

  useEffect(() => {
    if (!globalConfig?.data) return;
    const oidc = globalConfig.data.oidc;
    const loaded: OIDCForm = {
      enabled: Boolean(oidc?.enabled),
      googleClientID: String(oidc?.googleClientID ?? ''),
      egressAllowed: oidc?.egressAllowed ?? EMPTY_FORM.egressAllowed,
      // The stored set goes stale, so it is never shown: the field only takes a new one.
      googleJwkJson: EMPTY_FORM.googleJwkJson,
    };
    setForm(loaded);
    setInitial(loaded);
  }, [globalConfig?.data]);

  useEffect(() => {
    dispatch(fetchGlobalConfigThunk());
  }, [dispatch]);

  const validationError = useMemo(() => validate(form, hasPinnedKeys), [form, hasPinnedKeys]);

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
          key: 'save',
          label: C.LABELS.SAVE_BUTTON,
          variant: 'primary',
          loading: saving,
          disabled: !hasChanges || Boolean(validationError) || !canEdit,
          tooltip: deniedTooltip,
          onClick: handleSave,
        },
      ],
    }),
    [saving, hasChanges, validationError, canEdit, deniedTooltip, handleSave],
  );

  return (
    <SettingsCard title={C.LABELS.CARD_TITLE} description={C.LABELS.CARD_DESCRIPTION}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: C.LAYOUT.FIELD_GAP }}>
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
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{C.LABELS.CLIENT_ID_LABEL}</div>
              <Input
                placeholder={C.LABELS.CLIENT_ID_PLACEHOLDER}
                value={
                  canEdit || !form.googleClientID
                    ? form.googleClientID
                    : C.LABELS.CLIENT_ID_REDACTED
                }
                disabled={!canEdit}
                onChange={(e) => update('googleClientID', e.target.value)}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: C.LAYOUT.ROW_GAP,
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{C.LABELS.EGRESS_LABEL}</div>
                <div style={{ fontSize: 12 }}>{C.LABELS.EGRESS_HINT}</div>
              </div>
              <Switch
                checked={form.egressAllowed}
                onChange={canEdit ? (v: boolean) => update('egressAllowed', v) : undefined}
                disabled={!canEdit}
                tooltip={deniedTooltip}
              />
            </div>

            {!form.egressAllowed ? (
              <div>
                <div style={{ fontWeight: 700 }}>{C.LABELS.JWK_LABEL}</div>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  {C.LABELS.JWK_SOURCE_HINT}{' '}
                  <a href={C.LINKS.JWKS_URL} target="_blank" rel="noreferrer">
                    {C.LINKS.JWKS_URL}
                  </a>
                  {C.LABELS.JWK_SOURCE_HINT_END}
                  {hasPinnedKeys ? ` ${C.LABELS.JWK_KEEP_HINT}` : null}
                </div>
                <Input.TextArea
                  placeholder={C.LABELS.JWK_PLACEHOLDER}
                  value={form.googleJwkJson}
                  disabled={!canEdit}
                  rows={C.LAYOUT.JWK_ROWS}
                  onChange={(e) => update('googleJwkJson', e.target.value)}
                />
              </div>
            ) : null}

            {validationError ? (
              <div style={{ color: C.COLORS.ERROR_TEXT, fontWeight: 700 }}>{validationError}</div>
            ) : null}
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Toolbar config={saveToolbarConfig} />
        </div>
      </div>
    </SettingsCard>
  );
});

OIDCSection.displayName = 'OIDCSection';

export default OIDCSection;
