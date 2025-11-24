import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TimelineMarkerProps } from '../../../interfaces/layout/timeline';
import { TIMELINE_STYLES, DEFAULT_COLORS } from '../../../constants';

export const TimelineMarker: React.FC<TimelineMarkerProps> = React.memo(
  ({ status, isLast, markerLeft, maskHeight }) => {
    const isError = /error|failed|fail|danger/i.test(status);
    const fillColor = isError ? DEFAULT_COLORS.DANGER : DEFAULT_COLORS.SUCCESS;
    const iconNode = isError ? (
      <CloseOutlined style={TIMELINE_STYLES.MARKER.icon} />
    ) : (
      <CheckOutlined style={TIMELINE_STYLES.MARKER.icon} />
    );

    return (
      <>
        {/* Rail gap mask behind marker/halo */}
        <div
          style={{
            ...TIMELINE_STYLES.MARKER.railGapMask,
            left: markerLeft,
            height: maskHeight,
          }}
        />

        {/* Last item halo */}
        {isLast && (
          <div
            style={{
              ...TIMELINE_STYLES.MARKER.halo,
              left: markerLeft,
            }}
          />
        )}

        {/* Marker */}
        <div
          style={{
            ...TIMELINE_STYLES.MARKER.container,
            left: markerLeft,
            background: fillColor,
          }}
        >
          {iconNode}
        </div>
      </>
    );
  },
);

TimelineMarker.displayName = 'TimelineMarker';
