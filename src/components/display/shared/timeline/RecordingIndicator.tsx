import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import type { RecordingIndicatorProps } from '../../../../interfaces/timeline';
import { TIMELINE_CONSTANTS, TIMELINE_STYLES, UI } from '../../../../constants';

export const RecordingIndicator: React.FC<RecordingIndicatorProps> = React.memo(
  ({ markerLeft }) => {
    const MARKER_SIZE = UI.HISTORY.TIMELINE.MARKER_SIZE;

    return (
      <>
        {/* Extra spacer to show more rail segment between last item and recording marker */}
        <div style={TIMELINE_STYLES.RECORDING.spacer} />

        <div
          style={{
            ...TIMELINE_STYLES.RECORDING.container,
            minHeight: MARKER_SIZE + TIMELINE_CONSTANTS.GAP_AROUND * 2,
          }}
        >
          {/* Rail gap mask for spinner marker */}
          <div
            style={{
              ...TIMELINE_STYLES.RECORDING.railGapMask,
              left: markerLeft,
              height: MARKER_SIZE + TIMELINE_CONSTANTS.GAP_AROUND * 2,
            }}
          />

          {/* Spinner icon only */}
          <div
            style={{
              ...TIMELINE_STYLES.RECORDING.spinnerContainer,
              left: markerLeft,
            }}
          >
            <LoadingOutlined style={TIMELINE_STYLES.RECORDING.spinner} spin />
          </div>

          <div style={TIMELINE_STYLES.RECORDING.content}>
            <div style={TIMELINE_STYLES.RECORDING.text}>{UI.HISTORY.RECORDING}</div>
          </div>
        </div>
      </>
    );
  },
);

RecordingIndicator.displayName = 'RecordingIndicator';
