import React from 'react';
import { DEFAULT_COLORS } from '../../constants';

export interface LabelProps {
  icon: React.ReactNode;
  text: string;
}

const Label: React.FC<LabelProps> = React.memo(({ icon, text }) => (
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

Label.displayName = 'Label';

export default Label;
