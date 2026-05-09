import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = memo(({ title, description, children }) => {
  const hasDescription = description != null && description.length > 0;

  return (
    <div style={{ width: '100%' }}>
      {title.length > 0 && (
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            marginBottom: hasDescription ? 0 : 12,
          }}
        >
          {title}
        </div>
      )}
      {hasDescription && (
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 13,
            color: DEFAULT_COLORS.TEXT_MUTED,
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>
      )}
      <div>{children}</div>
    </div>
  );
});

SectionCard.displayName = 'SectionCard';

export default SectionCard;
