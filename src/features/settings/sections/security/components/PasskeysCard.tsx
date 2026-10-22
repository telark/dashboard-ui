import React, { memo } from 'react';
import { DEFAULT_COLORS, UNSTYLED_BUTTON, FONT_SIZE, FONT_WEIGHT } from '../../../../../constants';
import SettingsCard from '../../../components/SettingsCard';
import { SECURITY_SECTION_CONSTANTS } from '../constants';

const { LABELS } = SECURITY_SECTION_CONSTANTS;

const linkStyle: React.CSSProperties = {
  ...UNSTYLED_BUTTON,
  fontSize: FONT_SIZE.BASE,
  fontWeight: FONT_WEIGHT.MEDIUM,
  color: DEFAULT_COLORS.SUCCESS,
  textDecoration: 'none',
  fontFamily: 'inherit',
};

export interface PasskeysCardProps {
  onManagePasskeysClick?: () => void;
}

const PasskeysCard: React.FC<PasskeysCardProps> = memo(({ onManagePasskeysClick }) => (
  <SettingsCard title={LABELS.PASSKEYS_CARD_TITLE} description={LABELS.PASSKEYS_CARD_DESCRIPTION}>
    <div style={{ fontSize: FONT_SIZE.BASE, color: DEFAULT_COLORS.TEXT_SECONDARY }}>
      {onManagePasskeysClick ? (
        <button type="button" style={linkStyle} onClick={onManagePasskeysClick}>
          {LABELS.PASSKEYS_MANAGE_LINK}
        </button>
      ) : (
        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{LABELS.PASSKEYS_MANAGE_LINK}</span>
      )}
    </div>
  </SettingsCard>
));

PasskeysCard.displayName = 'PasskeysCard';

export default PasskeysCard;
