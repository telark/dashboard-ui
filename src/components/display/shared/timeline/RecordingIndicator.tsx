import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, UI } from '../../../../constants';

interface RecordingIndicatorProps {
  markerLeft: number;
}

const MARKER_SIZE = UI.HISTORY.TIMELINE.MARKER_SIZE;
const GAP_AROUND = 6;
const LINE_WIDTH = UI.HISTORY.TIMELINE.RAIL_WIDTH;

export const RecordingIndicator: React.FC<RecordingIndicatorProps> = React.memo(
  ({ markerLeft }) => {
    return (
      <>
        {/* Extra spacer to show more rail segment between last item and recording marker */}
        <div style={{ height: 20 }} />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minHeight: MARKER_SIZE + GAP_AROUND * 2,
            gap: 14,
          }}
        >
          {/* Rail gap mask for spinner marker */}
          <div
            style={{
              position: 'absolute',
              left: markerLeft,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: LINE_WIDTH + 6,
              height: MARKER_SIZE + GAP_AROUND * 2,
              background: '#fff',
              zIndex: 1,
            }}
          />

          {/* Spinner icon only */}
          <div
            style={{
              position: 'absolute',
              left: markerLeft,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
            }}
          >
            <LoadingOutlined style={{ fontSize: 14, color: DEFAULT_COLORS.SUCCESS }} spin />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              lineHeight: 1.25,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 16, color: '#5B6B7C' }}>
              {UI.HISTORY.RECORDING}
            </div>
          </div>
        </div>
      </>
    );
  },
);

RecordingIndicator.displayName = 'RecordingIndicator';
