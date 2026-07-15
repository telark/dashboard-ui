import type React from 'react';
import { AVATAR_RING, DEFAULT_COLORS } from '../../../constants';

export function avatarRingStyle(size: number): React.CSSProperties {
  const ringSize = size + AVATAR_RING.BORDER_WIDTH * 2;
  return {
    width: ringSize,
    height: ringSize,
    flexShrink: 0,
    borderRadius: '50%',
    border: `${AVATAR_RING.BORDER_WIDTH}px solid ${DEFAULT_COLORS.SUCCESS}`,
    padding: AVATAR_RING.BORDER_WIDTH,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  };
}
