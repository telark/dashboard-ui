import React from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';

interface AuthFooterProps {
  text: string;
  linkText: string;
  // An in-app link takes onLinkClick, an external page (opened in a new tab) takes linkHref.
  onLinkClick?: () => void;
  linkHref?: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  linkText,
  onLinkClick,
  linkHref,
}) => {
  const mutedStyle: React.CSSProperties = {
    fontSize: '11px',
    color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
  };
  const linkProps = {
    style: {
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
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.textDecorationColor = `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.textDecorationColor = `var(--auth-card-border, ${DEFAULT_COLORS.AUTH_LIGHT_BORDER})`;
    },
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
        {linkHref ? (
          <a href={linkHref} target="_blank" rel="noopener noreferrer" {...linkProps}>
            {linkText}
          </a>
        ) : (
          <button type="button" onClick={onLinkClick} {...linkProps}>
            {linkText}
          </button>
        )}
      </div>

      <div
        style={{
          borderTop: `1px solid var(--auth-divider, ${DEFAULT_COLORS.AUTH_LIGHT_DIVIDER})`,
          marginBottom: '14px',
        }}
      />

      <p style={{ ...mutedStyle, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
        {LOGIN_CONSTANTS.UI.TERMS_TEXT}{' '}
        <a
          href={LOGIN_CONSTANTS.UI.TERMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...mutedStyle, textDecoration: 'underline' }}
        >
          {LOGIN_CONSTANTS.UI.TERMS_LINK}
        </a>
        {LOGIN_CONSTANTS.UI.TERMS_END}
      </p>
    </div>
  );
};
