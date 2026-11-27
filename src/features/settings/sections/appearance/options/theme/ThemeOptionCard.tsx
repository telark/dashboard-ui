import React, { memo, useEffect } from 'react';
import { Segmented, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { DEFAULT_COLORS, getPillColor, NEW_TAG_TEXT } from '../../../../../../constants';
import { fetchCurrentUserDetails } from '../../../../../access-and-permissions/users/utils';
import { setCurrentUser } from '../../../../../auth/utils/session/user';
import {
  selectThemePreference,
  THEME_PREFERENCES,
  useSaveThemePreference,
} from '../../../../../theme';
import SettingsCard from '../../../../components/SettingsCard';
import { APPEARANCE_SECTION_CONSTANTS } from '../../constants';

const { LABELS } = APPEARANCE_SECTION_CONSTANTS;

const OPTIONS = THEME_PREFERENCES.map((value) => ({ value, label: LABELS.THEME_OPTIONS[value] }));

const ThemeOptionCard: React.FC = memo(() => {
  const preference = useSelector(selectThemePreference);
  const saveThemePreference = useSaveThemePreference();

  // A theme chosen on another device shows when the card opens.
  useEffect(() => {
    let canceled = false;
    fetchCurrentUserDetails((fresh) => {
      if (!canceled) setCurrentUser(fresh);
    });
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <SettingsCard
      title={LABELS.THEME_CARD_TITLE}
      description={LABELS.THEME_CARD_DESCRIPTION}
      titleBadge={<Tag color={getPillColor(DEFAULT_COLORS.SUCCESS)}>{NEW_TAG_TEXT}</Tag>}
      headerAction={
        <Segmented
          aria-label={LABELS.THEME_CARD_TITLE}
          options={OPTIONS}
          value={preference}
          onChange={saveThemePreference}
        />
      }
    >
      {null}
    </SettingsCard>
  );
});

ThemeOptionCard.displayName = 'ThemeOptionCard';

export default ThemeOptionCard;
