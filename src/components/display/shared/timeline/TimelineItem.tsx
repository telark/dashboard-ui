import React from 'react';
import type { Record } from '../../../../interfaces/shared';
import TimeAgo from '../../../time/TimeAgo';
import { TimelineMarker } from './TimelineMarker';
import { UI } from '../../../../constants';
import { CapitalizeFirstLetter } from '../../../../utils/helpers/format';

interface TimelineItemProps {
  item: Record;
  index: number;
  lastIndex: number;
  markerLeft: number;
}

const PADDING_LEFT = 42;
const RAIL_X = 18;
const MARKER_SIZE = UI.HISTORY.TIMELINE.MARKER_SIZE;
const GAP_AROUND = 6;
const HALO_SIZE = UI.HISTORY.TIMELINE.HALO_SIZE_LAST;

export const TimelineItem: React.FC<TimelineItemProps> = React.memo(
  ({ item, index, lastIndex, markerLeft }) => {
    const isLast = index === lastIndex;
    const maskHeight = isLast ? HALO_SIZE + 4 : MARKER_SIZE + GAP_AROUND * 2;

    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          minHeight: Math.max(MARKER_SIZE + GAP_AROUND * 2, HALO_SIZE + 4),
          gap: 14,
        }}
      >
        <TimelineMarker
          status={item.status}
          isLast={isLast}
          markerLeft={markerLeft}
          maskHeight={maskHeight}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            lineHeight: 1.25,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 18, color: '#0B1F33' }}>
            {CapitalizeFirstLetter(item.name)}
          </div>
          <div style={{ color: '#5B6B7C', marginTop: 4, fontSize: 13 }}>
            <TimeAgo date={item.creationTime} />
          </div>
        </div>
      </div>
    );
  },
);

TimelineItem.displayName = 'TimelineItem';
