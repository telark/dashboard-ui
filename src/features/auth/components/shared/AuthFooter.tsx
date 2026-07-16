import React from 'react';

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
    color: 'var(--auth-text-muted, #94a3b8)',
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Register link */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--auth-text-muted, #64748b)',
          marginBottom: '16px',
        }}
      >
        {text}{' '}
        <button
          type="button"
          onClick={onLinkClick}
          style={{
            color: 'var(--auth-text-muted, #475569)',
            fontWeight: 600,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            fontSize: '13px',
            textDecoration: 'underline',
            textDecorationColor: 'var(--auth-card-border, #e2e8f0)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecorationColor = 'var(--auth-text-muted, #475569)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecorationColor = 'var(--auth-card-border, #e2e8f0)';
          }}
        >
          {linkText}
        </button>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--auth-divider, #f1f5f9)', marginBottom: '14px' }} />

      {/* Terms */}
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
