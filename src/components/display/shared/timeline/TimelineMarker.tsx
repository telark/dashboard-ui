import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, UI } from '../../../../constants';

interface TimelineMarkerProps {
  status: string;
  isLast: boolean;
  markerLeft: number;
  maskHeight: number;
}

const MARKER_SIZE = UI.HISTORY.TIMELINE.MARKER_SIZE;
const HALO_SIZE = UI.HISTORY.TIMELINE.HALO_SIZE_LAST;
const LINE_WIDTH = UI.HISTORY.TIMELINE.RAIL_WIDTH;

export const TimelineMarker: React.FC<TimelineMarkerProps> = React.memo(
  ({ status, isLast, markerLeft, maskHeight }) => {
    const isError = /error|failed|fail|danger/i.test(status);
    const fillColor = isError ? DEFAULT_COLORS.DANGER : DEFAULT_COLORS.SUCCESS;
    const iconNode = isError ? (
      <CloseOutlined style={{ fontSize: 10, color: '#fff' }} />
    ) : (
      <CheckOutlined style={{ fontSize: 10, color: '#fff' }} />
    );

    return (
      <>
        {/* Rail gap mask behind marker/halo */}
        <div
          style={{
            position: 'absolute',
            left: markerLeft,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: LINE_WIDTH + 6,
            height: maskHeight,
            background: '#fff',
            zIndex: 1,
          }}
        />

        {/* Last item halo */}
        {isLast && (
          <div
            style={{
              position: 'absolute',
              left: markerLeft,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: HALO_SIZE,
              height: HALO_SIZE,
              borderRadius: '50%',
              background: 'rgba(32,201,151,0.15)',
              zIndex: 2,
            }}
          />
        )}

        {/* Marker */}
        <div
          style={{
            position: 'absolute',
            left: markerLeft,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: MARKER_SIZE,
            height: MARKER_SIZE,
            borderRadius: '50%',
            background: fillColor,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
          }}
        >
          {iconNode}
        </div>
      </>
    );
  },
);

TimelineMarker.displayName = 'TimelineMarker';
