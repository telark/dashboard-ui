import React from 'react';
import type { Record } from '../../../../interfaces/shared';
import { TimelineRail } from './TimelineRail';
import { TimelineItem } from './TimelineItem';
import { RecordingIndicator } from './RecordingIndicator';
import { UI } from '../../../../constants';

interface TimelineViewProps {
  items: Record[];
  withRecording?: boolean;
}

const PADDING_LEFT = 42;
const RAIL_X = 18;
const MARKER_SIZE = UI.HISTORY.TIMELINE.MARKER_SIZE;
const GAP_AROUND = 6;

export const TimelineView: React.FC<TimelineViewProps> = React.memo(
  ({ items, withRecording = false }) => {
    const markerLeft = -(PADDING_LEFT - RAIL_X);
    const cutHeight = MARKER_SIZE / 2 + GAP_AROUND;
    const lastIndex = items.length - 1;

    return (
      <div style={{ position: 'relative', paddingLeft: PADDING_LEFT }}>
        <TimelineRail cutHeight={cutHeight} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item: Record, idx: number) => (
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
