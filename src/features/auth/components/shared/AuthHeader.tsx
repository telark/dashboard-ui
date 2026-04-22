import React from 'react';

interface AuthHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ icon, title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
    {icon && (
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'var(--color-primary, #1e293b)',
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
      style={{
        margin: 0,
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--auth-text-primary, #0B1F33)',
        letterSpacing: '-0.4px',
        lineHeight: 1.25,
      }}
    >
      {title}
    </h1>
    <p
      style={{
        margin: '8px 0 0',
        fontSize: '14px',
        color: 'var(--auth-text-muted, #64748b)',
        lineHeight: 1.5,
        opacity: 0.85,
      }}
    >
      {subtitle}
    </p>
  </div>
);
