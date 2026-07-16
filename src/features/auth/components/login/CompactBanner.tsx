import React from 'react';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { DEFAULT_COLORS } from '../../../../constants';

export const CompactBanner: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img
      src={LOGIN_CONSTANTS.UI.BRAND_LOGO_SRC}
      alt={LOGIN_CONSTANTS.UI.BRAND_NAME}
      style={{ height: '16px' }}
    />
    {/* Tagline is a full sentence; it only earns bar space above 768px. */}
    <span className="auth-banner-note" style={{ color: '#475569', fontSize: '13px' }}>
      ·
    </span>
    <span
      className="auth-banner-note"
      style={{ fontSize: '13px', color: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_TAGLINE}
    </span>
  </div>
);
