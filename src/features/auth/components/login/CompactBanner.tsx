import React from 'react';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { DEFAULT_COLORS, FONT_SIZE } from '../../../../constants';

export const CompactBanner: React.FC = () => (
  <div
    // 10: the banner gap sits between SM and MD.
    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
  >
    <img
      src={LOGIN_CONSTANTS.UI.BRAND_LOGO_SRC}
      alt={LOGIN_CONSTANTS.UI.BRAND_NAME}
      style={{ height: '16px' }}
    />
    {/* Tagline is a full sentence; it only earns bar space above 768px. */}
    <span
      className="auth-banner-note"
      style={{ color: DEFAULT_COLORS.AUTH_DARK_TEXT_MUTED, fontSize: FONT_SIZE.MD }}
    >
      ·
    </span>
    <span
      className="auth-banner-note"
      style={{ fontSize: FONT_SIZE.MD, color: DEFAULT_COLORS.AUTH_DARK_TEXT_MUTED }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_TAGLINE}
    </span>
  </div>
);
