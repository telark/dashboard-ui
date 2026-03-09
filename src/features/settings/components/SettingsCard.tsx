import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../constants';
import { DEFAULT_COLORS } from '../../../constants';

const { CONTENT } = SETTINGS_CONSTANTS;

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = memo(({ title, description, children }) => {
  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRadius: CONTENT.CARD_BORDER_RADIUS,
        padding: CONTENT.CARD_PADDING,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
      }}
    >
      <div style={{ marginBottom: description ? 12 : 16 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 13,
              color: DEFAULT_COLORS.TEXT_MUTED,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
});

SettingsCard.displayName = 'SettingsCard';

export default SettingsCard;
