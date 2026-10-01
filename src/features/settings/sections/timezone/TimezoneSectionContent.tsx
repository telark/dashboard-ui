import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Select } from 'antd';
import SettingsCard from '../../components/SettingsCard';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import { updateUser } from '../../../access-and-permissions/users/clients';
import { fetchCurrentUserDetails } from '../../../access-and-permissions/users/utils';
import { getCurrentUser, setCurrentUser } from '../../../auth/utils/session/user';
import {
  formatTimeZoneOffset,
  getBrowserRegion,
  getBrowserTimeZone,
  getSupportedTimeZones,
  isValidTimeZone,
} from '../../../../utils/shared/time';
import type { User, UserSettings } from '../../../access-and-permissions/users/models';
import { TIMEZONE_SECTION_CONSTANTS } from './constants';

const { LABELS, REGION_CODES, DISPLAY_LOCALE } = TIMEZONE_SECTION_CONSTANTS;

const buildTimeZoneOptions = () =>
  getSupportedTimeZones().map((zone) => ({
    value: zone,
    label: `${zone} (${formatTimeZoneOffset(zone)})`,
  }));

const buildRegionOptions = () => {
  const names = new Intl.DisplayNames([DISPLAY_LOCALE], { type: 'region' });
  return REGION_CODES.map((code) => ({ value: code, label: `${names.of(code)} (${code})` })).sort(
    (a, b) => a.label.localeCompare(b.label),
  );
};

// Unsaved preferences fall back to what the browser reports.
const toDraft = (settings?: UserSettings): UserSettings => ({
  timezone:
    settings?.timezone && isValidTimeZone(settings.timezone)
      ? settings.timezone
      : getBrowserTimeZone(),
  region: settings?.region ?? getBrowserRegion(),
});

const TimezoneSectionContent: React.FC = memo(() => {
  const { message } = AntdApp.useApp();
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [draft, setDraft] = useState<UserSettings>(() => toDraft(getCurrentUser()?.settings));
  const [saving, setSaving] = useState(false);
  const timeZoneOptions = useMemo(buildTimeZoneOptions, []);
  const regionOptions = useMemo(buildRegionOptions, []);

  useEffect(() => {
    let canceled = false;
    fetchCurrentUserDetails((fresh) => {
      if (canceled) return;
      setCurrentUser(fresh);
      setUser(fresh);
      setDraft(toDraft(fresh.settings));
    });
    return () => {
      canceled = true;
    };
  }, []);

  const hasChanges =
    draft.timezone !== user?.settings?.timezone || draft.region !== user?.settings?.region;

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const response = await updateUser(user.id, { settings: { ...user.settings, ...draft } });
      const saved = response?.data;
      if (!saved) {
        message.error(LABELS.SAVE_ERROR);
        return;
      }
      setCurrentUser(saved);
      setUser(saved);
      setDraft(toDraft(saved.settings));
      if (saved.settings?.timezone === draft.timezone) {
        message.success(LABELS.SAVE_SUCCESS);
      } else {
        message.error(LABELS.SAVE_NOT_PERSISTED);
      }
    } catch {
      message.error(LABELS.SAVE_ERROR);
    } finally {
      setSaving(false);
    }
  }, [user, draft, message]);

  const saveToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: 'save',
          label: LABELS.SAVE_BUTTON,
          variant: 'primary',
          loading: saving,
          disabled: !user || !hasChanges,
          onClick: handleSave,
        },
      ],
    }),
    [saving, user, hasChanges, handleSave],
  );

  return (
    <SettingsCard title={LABELS.CARD_TITLE} description={LABELS.CARD_DESCRIPTION}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{LABELS.TIMEZONE_LABEL}</div>
        <Select
          showSearch
          optionFilterProp="label"
          style={{ width: '100%' }}
          placeholder={LABELS.TIMEZONE_PLACEHOLDER}
          value={draft.timezone}
          options={timeZoneOptions}
          disabled={!user || saving}
          onChange={(timezone: string) => setDraft((prev) => ({ ...prev, timezone }))}
        />
        <div style={{ fontWeight: 700 }}>{LABELS.REGION_LABEL}</div>
        <Select
          showSearch
          optionFilterProp="label"
          style={{ width: '100%' }}
          placeholder={LABELS.REGION_PLACEHOLDER}
          value={draft.region}
          options={regionOptions}
          disabled={!user || saving}
          onChange={(region: string) => setDraft((prev) => ({ ...prev, region }))}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Toolbar config={saveToolbarConfig} />
        </div>
      </div>
    </SettingsCard>
  );
});

TimezoneSectionContent.displayName = 'TimezoneSectionContent';

export default TimezoneSectionContent;
