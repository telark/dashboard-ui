import React from 'react';
import { STATUS_DOT } from '../../../../constants';

const StatusDot: React.FC<{ color: string }> = ({ color }) => (
  <span aria-hidden style={{ ...STATUS_DOT, background: color, display: 'inline-block' }} />
);

export default StatusDot;
