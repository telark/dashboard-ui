import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';

interface FieldLabelProps {
  children: React.ReactNode;
}

const FieldLabel: React.FC<FieldLabelProps> = memo(({ children }) => (
  <div
    style={{
      color: DEFAULT_COLORS.TEXT_MUTED,
      marginBottom: 0,
      lineHeight: 1.2,
    }}
  >
    {children}
  </div>
));

FieldLabel.displayName = 'ProtectionPlansFieldLabel';

export default FieldLabel;
