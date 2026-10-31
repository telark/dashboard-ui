import type React from 'react';
import { AVATAR_RING, DEFAULT_COLORS } from '../../../constants';

export function avatarRingStyle(
  size: number,
  color: string = DEFAULT_COLORS.SUCCESS,
): React.CSSProperties {
  // Border-box: the ring holds its border and the same-width gap on each side, so the avatar never covers the ring.
  const ringSize = size + AVATAR_RING.BORDER_WIDTH * 4;
  return {
    width: ringSize,
    height: ringSize,
    flexShrink: 0,
    borderRadius: '50%',
    border: `${AVATAR_RING.BORDER_WIDTH}px solid ${color}`,
    padding: AVATAR_RING.BORDER_WIDTH,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  };
}
