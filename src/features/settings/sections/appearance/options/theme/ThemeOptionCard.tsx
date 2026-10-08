import React, { memo } from 'react';
import { Tag } from 'antd';
import { DEFAULT_COLORS, getPillColor } from '../../../../../../constants';
import SettingsCard from '../../../../components/SettingsCard';
import { APPEARANCE_SECTION_CONSTANTS } from '../../constants';

const { LABELS } = APPEARANCE_SECTION_CONSTANTS;

// Same badge as the AI insights "Experimental" tag.
const ThemeOptionCard: React.FC = memo(() => (
  <SettingsCard
    title={LABELS.THEME_CARD_TITLE}
    description={LABELS.THEME_CARD_DESCRIPTION}
    titleBadge={<Tag color={getPillColor(DEFAULT_COLORS.WARNING)}>{LABELS.COMING_SOON}</Tag>}
  >
    {null}
  </SettingsCard>
));

ThemeOptionCard.displayName = 'ThemeOptionCard';

export default ThemeOptionCard;
