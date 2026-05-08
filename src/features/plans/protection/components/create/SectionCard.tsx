import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
const CARD_BORDER_RADIUS = 8;
const CARD_PADDING = 20;

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = memo(({ title, description, children }) => {
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
        borderRadius: CARD_BORDER_RADIUS,
        padding: CARD_PADDING,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
      }}
    >
      <div style={headerStyle}>
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
      </div>
      {children}
    </div>
  );
});

SectionCard.displayName = 'SectionCard';

export default SectionCard;
