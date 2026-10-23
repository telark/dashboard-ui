import React from 'react';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { DEFAULT_COLORS, FONT_WEIGHT, FONT_SIZE, SPACING } from '../../../../constants';

export const BrandPanel: React.FC = () => (
  <div className="auth-brand" style={{ maxWidth: '560px', width: '100%' }}>
    <img
      src={LOGIN_CONSTANTS.UI.BRAND_LOGO_SRC}
      alt={LOGIN_CONSTANTS.UI.BRAND_NAME}
      // 44: the logo-to-headline space sits above XXXL.
      style={{ height: '38px', display: 'block', marginBottom: '44px' }}
    />

    <h2
      // 1.06 and 22: the display headline's tight leading and bottom margin sit off the scales.
      style={{
        fontSize: 'clamp(34px, 3.4vw, 52px)',
        fontWeight: FONT_WEIGHT.BOLD,
        lineHeight: 1.06,
        margin: '0 0 22px',
        color: DEFAULT_COLORS.AUTH_DARK_TEXT,
        letterSpacing: '-1.4px',
      }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_HEADLINE}
    </h2>

    <p
      // 26 and 1.75: the tagline's bottom margin and airy leading sit off the scales.
      style={{
        fontSize: FONT_SIZE.XL,
        color: DEFAULT_COLORS.AUTH_DARK_TEXT_MUTED,
        margin: '0 0 26px',
        lineHeight: 1.75,
        maxWidth: '44ch',
        textWrap: 'pretty',
      }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_TAGLINE}
    </p>

    {/* The promise the product is sold on; pulled out of the sentence so it
        carries its own weight. */}
    <p
      // 14 and 17: the accent line's gap and size sit between the MD-LG and LG-XL steps.
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        margin: SPACING.NONE,
        fontSize: '17px',
        fontWeight: FONT_WEIGHT.MEDIUM,
        letterSpacing: '-0.2px',
        color: DEFAULT_COLORS.AUTH_DARK_TEXT,
      }}
    >
      <span
        aria-hidden
        // 2: the accent rule's corner sits below RADIUS.XS.
        style={{
          width: '28px',
          height: '2px',
          background: DEFAULT_COLORS.SUCCESS,
          borderRadius: '2px',
          flexShrink: 0,
        }}
      />
      {LOGIN_CONSTANTS.UI.BRAND_TAGLINE_ACCENT}
    </p>
  </div>
);
