import React from 'react';
import { HOME_DASHBOARD_LAYOUT as L } from '../../constants/dashboard';

const StatusDot: React.FC<{ color: string }> = ({ color }) => (
  <span
    aria-hidden
    style={{
      width: L.DOT_SIZE_PX,
      height: L.DOT_SIZE_PX,
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
      display: 'inline-block',
    }}
  />
);

export default StatusDot;
