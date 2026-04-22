import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';

export interface MutedTextProps {
  value: string;
}

const MutedText: React.FC<MutedTextProps> = memo(({ value }) => (
  <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>{value}</div>
));

MutedText.displayName = 'MutedText';

export default MutedText;
