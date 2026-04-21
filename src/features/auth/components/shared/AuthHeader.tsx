import React from 'react';
import { DEFAULT_COLORS } from '../../../../constants';

interface AuthHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ icon, title, subtitle }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
      {icon && (
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: DEFAULT_COLORS.SUCCESS,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          {icon}
        </div>
      )}
      <h1
        style={{
          margin: 0,
          fontSize: '26px',
          fontWeight: 700,
          color: '#0B1F33',
          letterSpacing: '-0.5px',
          lineHeight: 1.25,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: '14px',
          color: '#64748b',
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
