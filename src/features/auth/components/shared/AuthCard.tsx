import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div
      style={{
        background: '#ffffff',
        padding: '40px 36px',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08), 0 1px 4px rgba(15, 23, 42, 0.04)',
        width: '100%',
        maxWidth: '440px',
        border: '1px solid #e2e8f0',
      }}
    >
      {children}
    </div>
  );
};
