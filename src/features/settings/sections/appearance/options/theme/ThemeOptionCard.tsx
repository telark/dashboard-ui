import React, { memo } from 'react';
import { DEFAULT_COLORS, withAlpha } from '../../../../../../constants';
import SettingsCard from '../../../../components/SettingsCard';
import { APPEARANCE_SECTION_CONSTANTS } from '../../constants';

const { LABELS } = APPEARANCE_SECTION_CONSTANTS;

const comingSoonRowStyle = {
  display: 'flex' as const,
  alignItems: 'center' as const,
  padding: '8px 12px',
  borderRadius: 6,
  background: withAlpha(DEFAULT_COLORS.SHADOW, 0.04),
  fontSize: 13,
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontWeight: 500,
} as const;

const ThemeOptionCard: React.FC = memo(() => (
  <SettingsCard title={LABELS.THEME_CARD_TITLE} description={LABELS.THEME_CARD_DESCRIPTION}>
    <div style={comingSoonRowStyle}>{LABELS.COMING_SOON}</div>
  </SettingsCard>
));

ThemeOptionCard.displayName = 'ThemeOptionCard';

export default ThemeOptionCard;
