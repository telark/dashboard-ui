import React from 'react';
import TimeAgo from '../../../time/TimeAgo';
import { TimelineMarker } from './TimelineMarker';
import { CapitalizeFirstLetter } from '../../../../utils/helpers/format';
import type { TimelineItemProps } from '../../../../interfaces/layout/timeline';
import { TIMELINE_CONSTANTS, TIMELINE_STYLES, UI } from '../../../../constants';

export const TimelineItem: React.FC<TimelineItemProps> = React.memo(
  ({ item, index, lastIndex, markerLeft }) => {
    const isLast = index === lastIndex;
    const MARKER_SIZE = UI.HISTORY.TIMELINE.MARKER_SIZE;
    const HALO_SIZE = UI.HISTORY.TIMELINE.HALO_SIZE_LAST;
    const maskHeight = isLast ? HALO_SIZE + 4 : MARKER_SIZE + TIMELINE_CONSTANTS.GAP_AROUND * 2;

    return (
      <div
        style={{
          ...TIMELINE_STYLES.ITEM.container,
          minHeight: Math.max(MARKER_SIZE + TIMELINE_CONSTANTS.GAP_AROUND * 2, HALO_SIZE + 4),
        }}
      >
        <TimelineMarker
          status={item.status}
          isLast={isLast}
          markerLeft={markerLeft}
          maskHeight={maskHeight}
        />

        {/* Content */}
        <div style={TIMELINE_STYLES.ITEM.content}>
          <div style={TIMELINE_STYLES.ITEM.name}>{CapitalizeFirstLetter(item.name)}</div>
          <div style={TIMELINE_STYLES.ITEM.time}>
            <TimeAgo date={item.creationTime} />
          </div>
        </div>
      </div>
    );
  },
);

TimelineItem.displayName = 'TimelineItem';
