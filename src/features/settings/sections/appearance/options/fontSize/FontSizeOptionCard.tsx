import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../../constants';
import SettingsCard from '../../../../components/SettingsCard';
import { APPEARANCE_SECTION_CONSTANTS } from '../../constants';

const { LABELS } = APPEARANCE_SECTION_CONSTANTS;

const comingSoonRowStyle = {
  display: 'flex' as const,
  alignItems: 'center' as const,
  padding: '8px 12px',
  borderRadius: 6,
  background: 'rgba(0,0,0,0.04)',
  fontSize: 13,
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontWeight: 500,
} as const;

const FontSizeOptionCard: React.FC = memo(() => (
  <SettingsCard title={LABELS.FONT_SIZE_CARD_TITLE} description={LABELS.FONT_SIZE_CARD_DESCRIPTION}>
    <div style={comingSoonRowStyle}>{LABELS.COMING_SOON}</div>
  </SettingsCard>
));

FontSizeOptionCard.displayName = 'FontSizeOptionCard';

export default FontSizeOptionCard;
