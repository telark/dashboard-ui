import React from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const ProtectionPlansHeader: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
    <h1
      style={{
        fontSize: 28,
        fontWeight: 700,
        color: DEFAULT_COLORS.TEXT_PRIMARY,
        margin: 0,
        padding: 0,
        lineHeight: 1.2,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {PPC.LABELS.HEADER_TITLE}
    </h1>
    <p
      style={{
        margin: 0,
        marginTop: 0,
        fontSize: 14,
        fontWeight: 400,
        color: DEFAULT_COLORS.TEXT_MUTED,
        padding: 0,
        lineHeight: 1.2,
        fontFamily: "'Roboto Condensed', sans-serif",
        maxWidth: 560,
      }}
    >
      {PPC.LABELS.HEADER_SUBTITLE}
    </p>
  </div>
);

export default ProtectionPlansHeader;

