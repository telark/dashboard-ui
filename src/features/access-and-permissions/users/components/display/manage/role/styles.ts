import type React from 'react';
import { DEFAULT_COLORS } from '../../../../../../../constants';

export const GROUP_TAG_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  fontSize: 12,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  padding: '2px 8px',
  background: `${DEFAULT_COLORS.SUCCESS}18`,
  borderRadius: 20,
  border: `1px solid ${DEFAULT_COLORS.SUCCESS}40`,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
};
