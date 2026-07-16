import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => (
  <div
    style={{
      background: 'var(--auth-card-bg, #ffffff)',
      padding: '22px 28px 14px',
      borderRadius: '14px',
      width: '100%',
      maxWidth: '420px',
      border: '1px solid var(--auth-card-border, #e2e8f0)',
    }}
  >
    {children}
  </div>
);
