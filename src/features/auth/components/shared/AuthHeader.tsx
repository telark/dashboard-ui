import React from 'react';
import {
  DEFAULT_COLORS,
  SPACING,
  RADIUS,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
} from '../../../../constants';

interface AuthHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ icon, title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: SPACING.XXL }}>
    {icon && (
      <div
        // 14: the icon-to-title space sits between MD and LG.
        style={{
          width: '48px',
          height: '48px',
          borderRadius: RADIUS.LG,
          background: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
        }}
      >
        {icon}
      </div>
    )}
    <h1
      // 22 and 1.25: the auth title's size and leading sit between the XXL-H2 and TIGHT-SNUG steps.
      style={{
        margin: SPACING.NONE,
        fontSize: '22px',
        fontWeight: FONT_WEIGHT.BOLD,
        color: `var(--auth-text-primary, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT})`,
        letterSpacing: '-0.4px',
        lineHeight: 1.25,
      }}
    >
      {title}
    </h1>
    <p
      // 3: the title-to-subtitle space sits between XXS and XS.
      style={{
        margin: '3px 0 0',
        fontSize: FONT_SIZE.BASE,
        color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
        lineHeight: LINE_HEIGHT.BASE,
        opacity: 0.85,
      }}
    >
      {subtitle}
    </p>
  </div>
);
