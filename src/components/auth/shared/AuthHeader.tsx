import React from 'react';
import { DEFAULT_COLORS } from '../../../constants';

interface AuthHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ icon, title, subtitle }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: DEFAULT_COLORS.SUCCESS,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        {icon}
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 600,
          color: '#1a1a1a',
          letterSpacing: '-0.5px',
        }}
      >
        {title}
      </h1>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: '14px',
          color: '#666',
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};

