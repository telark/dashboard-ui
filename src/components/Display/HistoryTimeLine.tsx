import React, { useMemo } from 'react';
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { HistoryInterface, Record } from '../../interfaces/common';
import { DEFAULT_COLORS } from '../../constants';
import TimeAgo from '../time/TimeAgo';

// Visual constants (no halo except last); user prefers thin rail
const PADDING_LEFT = 42; // reserved space on the left for rail + marker
const RAIL_X = 18; // rail center from wrapper's left edge
const MARKER_SIZE = 16; // solid circle diameter
const LINE_WIDTH = 1; // rail thickness
const GAP_AROUND = 6; // extra space above/below marker to "cut" the rail
const HALO_SIZE = 20; // smaller halo for the last item

const capitalizeFirst = (text: string): string =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

const HistoryTimeLine: React.FC<HistoryInterface> = ({ Records }) => {
  // Oldest first (top to bottom)
  const items = useMemo(() => {
    return [...Records].sort((a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime());
  }, [Records]);

  // Marker left relative to each row (row is inside padded wrapper)
  const markerLeft = -(PADDING_LEFT - RAIL_X);
  const cutHeight = MARKER_SIZE / 2 + GAP_AROUND; // mask height above the first marker

  return (
    <div style={{ position: 'relative', paddingLeft: PADDING_LEFT }}>
      {/* Continuous vertical rail behind all markers */}
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

      {/* Top mask so the rail doesn't appear above the first marker */}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item: Record, idx: number) => {
          const isLast = idx === items.length - 1;
          const isOk = /success|completed|ok|available/i.test(item.status);
          const isError = /error|failed|fail|danger/i.test(item.status);
          const maskHeight = isLast ? HALO_SIZE + 4 : MARKER_SIZE + GAP_AROUND * 2; // ensure rail doesn't touch halo
          const fillColor = isError ? DEFAULT_COLORS.DANGER : DEFAULT_COLORS.SUCCESS;
          const iconNode = isError ? (
            <CloseOutlined style={{ fontSize: 10, color: '#fff' }} />
          ) : (
            <CheckOutlined style={{ fontSize: 10, color: '#fff' }} />
          );

          return (
            <div
              key={`${item.name}-${idx}`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                minHeight: Math.max(MARKER_SIZE + GAP_AROUND * 2, HALO_SIZE + 4),
                gap: 14,
              }}
            >
              {/* Rail gap mask: hides rail behind the marker/halo with extra space */}
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

              {/* Optional halo for the last item only */}
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

              {/* Marker aligned to the global rail */}
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

              {/* Content */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.25 }}>
                <div style={{ fontWeight: 600, fontSize: 18, color: '#0B1F33' }}>{capitalizeFirst(item.name)}</div>
                <div style={{ color: '#5B6B7C', marginTop: 4, fontSize: 13 }}>
                  <TimeAgo date={item.creationTime} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Pending/Recording marker at bottom */}
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

          {/* Spinner icon only (no border/circle) */}
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

          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.25 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#5B6B7C' }}>Recording…</div>
          </div>
        </div>
      </div>

      {/* Bottom mask so the rail doesn't appear below the pending marker */}
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
    </div>
  );
};

export default HistoryTimeLine;
