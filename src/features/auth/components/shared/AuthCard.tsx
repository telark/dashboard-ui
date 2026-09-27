import React from 'react';
import { DEFAULT_COLORS } from '../../../../constants';

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => (
  <div
    style={{
      background: `var(--auth-card-bg, ${DEFAULT_COLORS.AUTH_LIGHT_CARD_BG})`,
      padding: '22px 28px 14px',
      borderRadius: '14px',
      width: '100%',
      maxWidth: '420px',
      border: `1px solid var(--auth-card-border, ${DEFAULT_COLORS.AUTH_LIGHT_BORDER})`,
    }}
  >
    {children}
  </div>
);
