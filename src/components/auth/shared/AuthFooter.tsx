import React from 'react';
import { DEFAULT_COLORS } from '../../../constants';

interface AuthFooterProps {
  text: string;
  linkText: string;
  onLinkClick: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ text, linkText, onLinkClick }) => {
  return (
    <div
      style={{
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#999',
      }}
    >
      {text}{' '}
      <a
        onClick={onLinkClick}
        style={{
          color: DEFAULT_COLORS.SUCCESS,
          textDecoration: 'none',
          fontWeight: 500,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = 'underline';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = 'none';
        }}
      >
        {linkText}
      </a>
    </div>
  );
};
