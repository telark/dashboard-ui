import React from 'react';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { DEFAULT_COLORS } from '../../../../constants';
import { TerminalDemo } from './TerminalDemo';

export const BrandPanel: React.FC = () => (
  <div style={{ maxWidth: '340px', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '52px' }}>
      <img
        src={LOGIN_CONSTANTS.UI.BRAND_LOGO_SRC}
        alt={LOGIN_CONSTANTS.UI.BRAND_NAME}
        style={{ height: '30px' }}
      />
    </div>

    <h2
      style={{
        fontSize: '30px',
        fontWeight: 700,
        lineHeight: 1.25,
        margin: '0 0 14px',
        color: '#f8fafc',
        letterSpacing: '-0.7px',
      }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_HEADLINE}
    </h2>

    <p
      style={{
        fontSize: '14px',
        color: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
        margin: '0 0 36px',
        lineHeight: 1.65,
      }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_TAGLINE}
    </p>

    <TerminalDemo />
  </div>
);
