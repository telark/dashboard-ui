import React, { memo, useCallback, useEffect, useRef } from 'react';
import { App as AntdApp, Segmented, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_COLORS, getPillColor } from '../../../../../../constants';
import { updateUser } from '../../../../../access-and-permissions/users/clients';
import { fetchCurrentUserDetails } from '../../../../../access-and-permissions/users/utils';
import { getCurrentUser, setCurrentUser } from '../../../../../auth/utils/session/user';
import {
  readUserThemePreference,
  selectThemePreference,
  setThemePreference,
  THEME_PREFERENCES,
  type ThemePreference,
} from '../../../../../theme';
import SettingsCard from '../../../../components/SettingsCard';
import { APPEARANCE_SECTION_CONSTANTS } from '../../constants';

const { LABELS } = APPEARANCE_SECTION_CONSTANTS;

const OPTIONS = THEME_PREFERENCES.map((value) => ({ value, label: LABELS.THEME_OPTIONS[value] }));

const ThemeOptionCard: React.FC = memo(() => {
  const { message } = AntdApp.useApp();
  const dispatch = useDispatch();
  const preference = useSelector(selectThemePreference);
  const latestChoice = useRef<ThemePreference>(preference);

  // The server replaces settings whole, so the save below must start from its current values.
  useEffect(() => {
    let canceled = false;
    fetchCurrentUserDetails((fresh) => {
      if (!canceled) setCurrentUser(fresh);
    });
    return () => {
      canceled = true;
    };
  }, []);

  const onChange = useCallback(
    async (theme: ThemePreference) => {
      const user = getCurrentUser();
      if (!user) return;
      latestChoice.current = theme;
      dispatch(setThemePreference(theme));
      // A quick second choice wins: an older answer must not flip the theme back.
      const isLatest = () => latestChoice.current === theme;
      try {
        const response = await updateUser(user.id, { settings: { ...user.settings, theme } });
        if (!response?.data) throw new Error(LABELS.SAVE_ERROR);
        if (isLatest()) setCurrentUser(response.data);
      } catch {
        if (!isLatest()) return;
        dispatch(setThemePreference(readUserThemePreference()));
        message.error(LABELS.SAVE_ERROR);
      }
    },
    [dispatch, message],
  );

  return (
    <SettingsCard
      title={LABELS.THEME_CARD_TITLE}
      description={LABELS.THEME_CARD_DESCRIPTION}
      titleBadge={
        <Tag
          color={getPillColor(DEFAULT_COLORS.SUCCESS)}
          style={{ color: DEFAULT_COLORS.PILL_TEXT }}
        >
          {LABELS.NEW_BADGE}
        </Tag>
      }
      headerAction={
        <Segmented
          aria-label={LABELS.THEME_CARD_TITLE}
          options={OPTIONS}
          value={preference}
          onChange={onChange}
        />
      }
    >
      {null}
    </SettingsCard>
  );
});

ThemeOptionCard.displayName = 'ThemeOptionCard';

export default ThemeOptionCard;
