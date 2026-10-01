import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { App as AntdApp } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import SettingsCard from '../../components/SettingsCard';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import { Client, authApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import { Switch } from '../../../../components/display/inputs';
import {
  ensureGlobalConfigThunk,
  fetchGlobalConfigThunk,
  selectGlobalConfigState,
} from '../../../globalconfig/store';
import type { AppDispatch } from '../../../../store';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';
import { useSignInSettingsAccess } from './useSignInSettingsAccess';

const SelfRegistrationSection: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = AntdApp.useApp();
  const { canEdit, deniedTooltip } = useSignInSettingsAccess();
  const stored = useSelector(selectGlobalConfigState).data?.selfRegistration?.enabled === true;
  const [draft, setDraft] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const enabled = draft ?? stored;
  const hasChanges = enabled !== stored;

  useEffect(() => {
    dispatch(ensureGlobalConfigThunk());
  }, [dispatch]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const { path, method } = Endpoints.AUTH.SELF_REGISTRATION;
      await Client<unknown>(authApiClient, path, { method, data: { enabled } });
      message.success(C.MESSAGES.SELF_REGISTRATION_SAVED);
      dispatch(fetchGlobalConfigThunk());
    } catch (err: unknown) {
      message.error(extractErrorMessage(err, C.MESSAGES.SELF_REGISTRATION_SAVE_FAILED));
    } finally {
      setSaving(false);
    }
  }, [enabled, dispatch, message]);

  const saveToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: 'save',
          label: C.LABELS.SAVE_BUTTON,
          variant: 'primary',
          loading: saving,
          disabled: !hasChanges || !canEdit,
          tooltip: deniedTooltip,
          onClick: handleSave,
        },
      ],
    }),
    [saving, hasChanges, canEdit, deniedTooltip, handleSave],
  );

  return (
    <SettingsCard title={C.LABELS.SELF_REGISTRATION_TITLE}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: C.LAYOUT.FIELD_GAP }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: C.LAYOUT.ROW_GAP,
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>{C.LABELS.SELF_REGISTRATION_LABEL}</div>
            <div style={{ fontSize: 12 }}>{C.LABELS.SELF_REGISTRATION_HINT}</div>
          </div>
          <Switch
            checked={enabled}
            onChange={setDraft}
            disabled={!canEdit}
            tooltip={deniedTooltip}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Toolbar config={saveToolbarConfig} />
        </div>
      </div>
    </SettingsCard>
  );
});

SelfRegistrationSection.displayName = 'SelfRegistrationSection';

export default SelfRegistrationSection;
