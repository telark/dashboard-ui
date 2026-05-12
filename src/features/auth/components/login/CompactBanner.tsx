import React from 'react';
import { LockOutlined } from '@ant-design/icons';
import { LOGIN_CONSTANTS } from '../../constants/login';

export const CompactBanner: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <LockOutlined style={{ fontSize: '14px', color: '#94a3b8' }} />
    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.2px' }}>
      {LOGIN_CONSTANTS.UI.BRAND_NAME}
    </span>
    <span style={{ color: '#475569', fontSize: '13px' }}>·</span>
    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{LOGIN_CONSTANTS.UI.BRAND_TAGLINE}</span>
  </div>
);
