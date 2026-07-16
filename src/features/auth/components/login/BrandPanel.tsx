import React from 'react';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { DEFAULT_COLORS } from '../../../../constants';

export const BrandPanel: React.FC = () => (
  <>
    {/* Ambient wash behind the type; never catches pointer events. */}
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: '-10%',
        left: '-15%',
        width: '70%',
        height: '60%',
        background: `radial-gradient(circle, ${DEFAULT_COLORS.SUCCESS_TINT} 0%, transparent 70%)`,
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }}
    />

    <div className="auth-brand" style={{ maxWidth: '560px', width: '100%', position: 'relative' }}>
      <img
        src={LOGIN_CONSTANTS.UI.BRAND_LOGO_SRC}
        alt={LOGIN_CONSTANTS.UI.BRAND_NAME}
        style={{ height: '38px', display: 'block', marginBottom: '44px' }}
      />

      <h2
        style={{
          fontSize: 'clamp(34px, 3.4vw, 52px)',
          fontWeight: 700,
          lineHeight: 1.06,
          margin: '0 0 22px',
          color: '#f8fafc',
          letterSpacing: '-1.4px',
        }}
      >
        {LOGIN_CONSTANTS.UI.BRAND_HEADLINE}
      </h2>

      <p
        style={{
          fontSize: '18px',
          color: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
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
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          margin: 0,
          fontSize: '17px',
          fontWeight: 500,
          letterSpacing: '-0.2px',
          color: '#f8fafc',
        }}
      >
        <span
          aria-hidden
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
  </>
);
