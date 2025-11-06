import React from 'react';
import { TimelineRail } from './TimelineRail';
import { TimelineItem } from './TimelineItem';
import { RecordingIndicator } from './RecordingIndicator';
import type { TimelineViewProps } from '../../../../interfaces/timeline';
import { TIMELINE_CONSTANTS, TIMELINE_STYLES, UI } from '../../../../constants';

export const TimelineView: React.FC<TimelineViewProps> = React.memo(
  ({ items, withRecording = false }) => {
    const markerLeft = -(TIMELINE_CONSTANTS.PADDING_LEFT - TIMELINE_CONSTANTS.RAIL_X);
    const cutHeight = UI.HISTORY.TIMELINE.MARKER_SIZE / 2 + TIMELINE_CONSTANTS.GAP_AROUND;
    const lastIndex = items.length - 1;

    return (
      <div
        style={{
          ...TIMELINE_STYLES.VIEW.container,
          paddingLeft: TIMELINE_CONSTANTS.PADDING_LEFT,
        }}
      >
        <TimelineRail cutHeight={cutHeight} />

        <div style={TIMELINE_STYLES.VIEW.itemsContainer}>
          {items.map((item, idx: number) => (
            <TimelineItem
              key={`${item.name}-${idx}`}
              item={item}
              index={idx}
              lastIndex={lastIndex}
              markerLeft={markerLeft}
            />
          ))}

          {withRecording && <RecordingIndicator markerLeft={markerLeft} />}
        </div>
      </div>
    );
  },
);

TimelineView.displayName = 'TimelineView';
