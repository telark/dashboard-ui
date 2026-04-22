import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => (
  <div
    style={{
      background: 'var(--auth-card-bg, #ffffff)',
      padding: '32px 28px',
      borderRadius: '14px',
      boxShadow: 'var(--auth-card-shadow, 0 20px 60px rgba(15,23,42,0.10), 0 4px 16px rgba(15,23,42,0.06))',
      width: '100%',
      maxWidth: '420px',
      border: '1px solid var(--auth-card-border, #e2e8f0)',
    }}
  >
    {children}
  </div>
);
