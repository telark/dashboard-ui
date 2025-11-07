import React from 'react';
import type { TimelineRailProps } from '../../../../interfaces/timeline';
import { TIMELINE_CONSTANTS, TIMELINE_STYLES } from '../../../../constants';

export const TimelineRail: React.FC<TimelineRailProps> = React.memo(({ cutHeight }) => {
  return (
    <>
      {/* Continuous rail */}
      <div
        style={{
          ...TIMELINE_STYLES.RAIL.continuous,
          left: TIMELINE_CONSTANTS.RAIL_X,
        }}
      />

      {/* Top mask (no rail above first marker) */}
      <div
        style={{
          ...TIMELINE_STYLES.RAIL.topMask,
          left: TIMELINE_CONSTANTS.RAIL_X,
          height: cutHeight,
        }}
      />

      {/* Bottom mask so rail doesn't extend beyond the last row / spinner */}
      <div
        style={{
          ...TIMELINE_STYLES.RAIL.bottomMask,
          left: TIMELINE_CONSTANTS.RAIL_X,
          height: cutHeight,
        }}
      />
    </>
  );
});

TimelineRail.displayName = 'TimelineRail';
