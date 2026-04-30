import React from 'react';
import { LockOutlined } from '@ant-design/icons';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { TerminalDemo } from './TerminalDemo';

export const BrandPanel: React.FC = () => (
  <div style={{ maxWidth: '340px', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '52px' }}>
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <LockOutlined style={{ fontSize: '15px', color: '#e2e8f0' }} />
      </div>
      <span
        style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.2px' }}
      >
        {LOGIN_CONSTANTS.UI.BRAND_NAME}
      </span>
    </div>

    <h2
      style={{
        fontSize: '30px',
        fontWeight: 700,
        lineHeight: 1.25,
        margin: '0 0 14px',
        color: '#f8fafc',
        letterSpacing: '-0.7px',
      }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_HEADLINE}
    </h2>

    <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 36px', lineHeight: 1.65 }}>
      {LOGIN_CONSTANTS.UI.BRAND_TAGLINE}
    </p>

    <TerminalDemo />
  </div>
);
