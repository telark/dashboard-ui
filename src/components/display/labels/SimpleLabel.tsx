import React from 'react';
import { DEFAULT_COLORS } from '../../../constants';

export interface SimpleLabelProps {
  icon: React.ReactNode;
  text: string;
}

const SimpleLabel: React.FC<SimpleLabelProps> = React.memo(({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ color: DEFAULT_COLORS.SUCCESS, fontSize: 16, display: 'inline-flex' }}>
      {icon}
    </span>
    <span
      style={{
        color: '#6b7280',
        fontWeight: 700,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}
    >
      {text}
    </span>
  </div>
));

SimpleLabel.displayName = 'SimpleLabel';

export default SimpleLabel;
