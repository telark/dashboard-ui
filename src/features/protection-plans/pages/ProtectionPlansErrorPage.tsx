import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../constants';

interface ProtectionPlansErrorPageProps {
  error: string;
}

const ProtectionPlansErrorPage: React.FC<ProtectionPlansErrorPageProps> = memo(({ error }) => {
  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        minHeight: 'calc(100vh - 60px)',
        padding: '48px 32px 32px',
        marginTop: '60px',
      }}
    >
      <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontSize: 16, fontWeight: 500 }}>
        Failed to load Protection Plans.
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 14,
          color: DEFAULT_COLORS.TEXT_MUTED,
          whiteSpace: 'pre-wrap',
        }}
      >
        {error}
      </div>
    </div>
  );
});

ProtectionPlansErrorPage.displayName = 'ProtectionPlansErrorPage';

export default ProtectionPlansErrorPage;

