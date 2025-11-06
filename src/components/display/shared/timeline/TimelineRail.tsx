import React from 'react';
import { DEFAULT_COLORS, UI } from '../../../../constants';

interface TimelineRailProps {
  cutHeight: number;
}

const PADDING_LEFT = 42;
const RAIL_X = 18;
const LINE_WIDTH = UI.HISTORY.TIMELINE.RAIL_WIDTH;

export const TimelineRail: React.FC<TimelineRailProps> = React.memo(({ cutHeight }) => {
  return (
    <>
      {/* Continuous rail */}
      <div
        style={{
          position: 'absolute',
          left: RAIL_X,
          top: 0,
          bottom: 0,
          width: LINE_WIDTH,
          background: DEFAULT_COLORS.SUCCESS,
          transform: 'translateX(-50%)',
          borderRadius: LINE_WIDTH / 2,
          opacity: 0.95,
        }}
      />

      {/* Top mask (no rail above first marker) */}
      <div
        style={{
          position: 'absolute',
          left: RAIL_X,
          top: 0,
          width: LINE_WIDTH + 4,
          height: cutHeight,
          background: '#fff',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      />

      {/* Bottom mask so rail doesn't extend beyond the last row / spinner */}
      <div
        style={{
          position: 'absolute',
          left: RAIL_X,
          bottom: 0,
          width: LINE_WIDTH + 6,
          height: cutHeight,
          background: '#fff',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      />
    </>
  );
});

TimelineRail.displayName = 'TimelineRail';
