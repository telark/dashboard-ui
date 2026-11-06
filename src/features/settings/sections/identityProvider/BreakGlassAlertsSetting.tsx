import React, { memo, useCallback, useMemo, useState } from 'react';
import { App as AntdApp } from 'antd';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import { Switch } from '../../../../components/display/inputs';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import { BOOTSTRAP_TEXTS as T, setBreakGlassAlerts } from '../../../bootstrap';
import { SETTINGS_CONSTANTS } from '../../constants';
import { SettingsStack, SettingsToggle } from '../../components/SettingsFields';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';

interface BreakGlassAlertsSettingProps {
  stored: boolean;
  onSaved: () => void;
}

// Auth takes this from the bootstrap account only: it decides who hears of its requests.
const BreakGlassAlertsSetting: React.FC<BreakGlassAlertsSettingProps> = memo(
  ({ stored, onSaved }) => {
    const { message } = AntdApp.useApp();
    const [draft, setDraft] = useState<boolean | null>(null);
    const [saving, setSaving] = useState(false);
    const enabled = draft ?? stored;
    const hasChanges = enabled !== stored;

    const handleSave = useCallback(async () => {
      setSaving(true);
      try {
        await setBreakGlassAlerts(enabled);
        message.success(T.ALERTS_SAVED);
        onSaved();
      } catch (err: unknown) {
        message.error(extractErrorMessage(err, T.ALERTS_SAVE_FAILED));
      } finally {
        setSaving(false);
      }
    }, [enabled, message, onSaved]);

    const saveToolbarConfig: ToolbarConfig = useMemo(
      () => ({
        buttons: [
          {
            key: SETTINGS_CONSTANTS.TOOLBAR.SAVE_KEY,
            label: C.LABELS.SAVE_BUTTON,
            variant: 'primary',
            loading: saving,
            disabled: !hasChanges,
            onClick: handleSave,
          },
        ],
      }),
      [saving, hasChanges, handleSave],
    );

    return (
      <SettingsStack>
        <SettingsToggle label={T.ALERTS_LABEL} hint={T.ALERTS_HINT}>
          <Switch checked={enabled} onChange={setDraft} />
        </SettingsToggle>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Toolbar config={saveToolbarConfig} />
        </div>
      </SettingsStack>
    );
  },
);

BreakGlassAlertsSetting.displayName = 'BreakGlassAlertsSetting';

export default BreakGlassAlertsSetting;
