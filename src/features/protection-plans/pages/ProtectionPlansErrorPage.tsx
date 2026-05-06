import React, { memo } from 'react';
import { DEFAULT_COLORS, HEADER_LAYOUT } from '../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

interface ProtectionPlansErrorPageProps {
  error: string;
}

const ProtectionPlansErrorPage: React.FC<ProtectionPlansErrorPageProps> = memo(({ error }) => {
  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        minHeight: HEADER_LAYOUT.MIN_HEIGHT,
        padding: '48px 32px 32px',
        marginTop: HEADER_LAYOUT.HEIGHT,
      }}
    >
      <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontSize: 16, fontWeight: 500 }}>
        {PPC.LABELS.MESSAGES.ERROR_TITLE}
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
