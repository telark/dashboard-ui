import React from 'react';
import { LoginOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';
import { LOGIN_CONSTANTS } from '../../../constants/pages/login';

export const LoginHeader: React.FC = () => {
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
        <LoginOutlined style={{ fontSize: '32px', color: '#ffffff' }} />
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
        {LOGIN_CONSTANTS.UI.TITLE}
      </h1>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: '14px',
          color: '#666',
        }}
      >
        {LOGIN_CONSTANTS.UI.SUBTITLE}
      </p>
    </div>
  );
};

