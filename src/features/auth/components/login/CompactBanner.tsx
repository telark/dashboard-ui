import React from 'react';
import { LOGIN_CONSTANTS } from '../../constants/login';

export const CompactBanner: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img
      src={LOGIN_CONSTANTS.UI.BRAND_LOGO_SRC}
      alt={LOGIN_CONSTANTS.UI.BRAND_NAME}
      style={{ height: '16px' }}
    />
    <span style={{ color: '#475569', fontSize: '13px' }}>·</span>
    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{LOGIN_CONSTANTS.UI.BRAND_TAGLINE}</span>
  </div>
);
