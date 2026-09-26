import React from 'react';
import { DEFAULT_COLORS } from '../../../../constants';

interface AuthFooterProps {
  text: string;
  linkText: string;
  onLinkClick: () => void;
  termsHref?: string;
  privacyHref?: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  linkText,
  onLinkClick,
  termsHref = '#',
  privacyHref = '#',
}) => {
  const mutedStyle: React.CSSProperties = {
    fontSize: '11px',
    color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div
        style={{
          textAlign: 'center',
          fontSize: '13px',
          color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
          marginBottom: '16px',
        }}
      >
        {text}{' '}
        <button
          type="button"
          onClick={onLinkClick}
          style={{
            color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
            fontWeight: 600,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            fontSize: '13px',
            textDecoration: 'underline',
            textDecorationColor: `var(--auth-card-border, ${DEFAULT_COLORS.AUTH_LIGHT_BORDER})`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecorationColor = `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecorationColor = `var(--auth-card-border, ${DEFAULT_COLORS.AUTH_LIGHT_BORDER})`;
          }}
        >
          {linkText}
        </button>
      </div>

      <div
        style={{
          borderTop: `1px solid var(--auth-divider, ${DEFAULT_COLORS.AUTH_LIGHT_DIVIDER})`,
          marginBottom: '14px',
        }}
      />

      <p style={{ ...mutedStyle, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
        By continuing you agree to our{' '}
        <a href={termsHref} style={{ ...mutedStyle, textDecoration: 'underline' }}>
          Terms
        </a>{' '}
        and{' '}
        <a href={privacyHref} style={{ ...mutedStyle, textDecoration: 'underline' }}>
          Privacy Policy
        </a>
      </p>
    </div>
  );
};
