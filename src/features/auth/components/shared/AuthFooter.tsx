import React from 'react';
import {
  DEFAULT_COLORS,
  UNSTYLED_BUTTON,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
  LINE_HEIGHT,
} from '../../../../constants';
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
    fontSize: FONT_SIZE.XS,
    color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
  };
  const linkProps = {
    style: {
      ...UNSTYLED_BUTTON,
      color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
      fontWeight: FONT_WEIGHT.SEMIBOLD,
      fontFamily: 'inherit',
      lineHeight: 'inherit',
      fontSize: FONT_SIZE.MD,
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
    <div style={{ marginTop: SPACING.XL }}>
      <div
        style={{
          textAlign: 'center',
          fontSize: FONT_SIZE.MD,
          color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
          marginBottom: SPACING.LG,
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
        // 14: the divider-to-terms space sits between MD and LG.
        style={{
          borderTop: `1px solid var(--auth-divider, ${DEFAULT_COLORS.AUTH_LIGHT_DIVIDER})`,
          marginBottom: '14px',
        }}
      />

      <p
        style={{
          ...mutedStyle,
          textAlign: 'center',
          margin: SPACING.NONE,
          lineHeight: LINE_HEIGHT.BASE,
        }}
      >
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
