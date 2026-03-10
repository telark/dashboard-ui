import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../constants';
import { DEFAULT_COLORS } from '../../../constants';

const { CONTENT } = SETTINGS_CONSTANTS;

interface SettingsCardProps {
  title: string;
  description?: string;
  headerStart?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = memo(
  ({ title, description, headerStart, headerAction, children }) => {
    const hasDescription = description != null && description.length > 0;
    const headerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: hasDescription || children ? (hasDescription ? 12 : 16) : 0,
    };

    return (
      <div
        style={{
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
          borderRadius: CONTENT.CARD_BORDER_RADIUS,
          padding: CONTENT.CARD_PADDING,
          border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        }}
      >
        <div style={headerStyle}>
          {headerStart != null ? (
            <div style={{ flexShrink: 0 }}>{headerStart}</div>
          ) : null}
          <div style={{ minWidth: 0, flex: 1 }}>
            {title.length > 0 && (
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
            )}
            {hasDescription && (
              <p
                style={{
                  margin: title.length > 0 ? '4px 0 0' : 0,
                  fontSize: 13,
                  color: DEFAULT_COLORS.TEXT_MUTED,
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {headerAction != null ? (
            <div style={{ flexShrink: 0 }}>{headerAction}</div>
          ) : null}
        </div>
        {children}
      </div>
    );
  },
);

SettingsCard.displayName = 'SettingsCard';

export default SettingsCard;
