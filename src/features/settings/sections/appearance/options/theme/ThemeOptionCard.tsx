import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../../constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import SettingsCard from '../../../../components/SettingsCard';
import { APPEARANCE_SECTION_CONSTANTS } from '../../constants';

const { LABELS, BADGE_FONT_SIZE_PX } = APPEARANCE_SECTION_CONSTANTS;

// Same badge as the AI insights "Experimental" tag.
const ThemeOptionCard: React.FC = memo(() => (
  <SettingsCard
    title={LABELS.THEME_CARD_TITLE}
    description={LABELS.THEME_CARD_DESCRIPTION}
    titleBadge={
      <RowTag
        text={LABELS.COMING_SOON}
        accent={DEFAULT_COLORS.WARNING}
        fontSize={BADGE_FONT_SIZE_PX}
      />
    }
  >
    {null}
  </SettingsCard>
));

ThemeOptionCard.displayName = 'ThemeOptionCard';

export default ThemeOptionCard;
