import React, { useMemo } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { HistoryInterface, Record } from '../../interfaces/common';
import { DEFAULT_COLORS } from '../../constants';
import TimeAgo from '../time/TimeAgo';

const RAIL_X = 12; // x-position of the rail center
const MARKER_SIZE = 12; // diameter in px
const LINE_WIDTH = 3; // connector thickness

const HistoryTimeLine: React.FC<HistoryInterface> = ({ Records }) => {
  // Newest first
  const items = useMemo(() => {
    return [...Records].sort((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime());
  }, [Records]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item: Record, idx: number) => {
        const isFirst = idx === 0;
        const isLast = idx === items.length - 1;
        const isOk = /success|completed|ok|available/i.test(item.status);
        return (
          <div
            key={`${item.name}-${idx}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minHeight: 40,
            }}
          >
            {/* Rail */}
            <div style={{ width: 30, position: 'relative', alignSelf: 'stretch' }}>
              {/* Top connector (to previous) - runs to center (hidden behind marker) */}
              {!isFirst && (
                <div
                  style={{
                    position: 'absolute',
                    left: RAIL_X,
                    top: 0,
                    height: '50%',
                    width: LINE_WIDTH,
                    background: DEFAULT_COLORS.SUCCESS,
                    transform: 'translateX(-50%)',
                    borderRadius: 2,
                  }}
                />
              )}
              {/* Marker */}
              <div
                style={{
                  position: 'absolute',
                  left: RAIL_X,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: MARKER_SIZE,
                  height: MARKER_SIZE,
                  borderRadius: '50%',
                  background: DEFAULT_COLORS.SUCCESS,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isOk ? <CheckOutlined style={{ fontSize: 8 }} /> : <CloseOutlined style={{ fontSize: 8 }} />}
              </div>
              {/* Bottom connector (to next) - runs from center (hidden behind marker) */}
              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    left: RAIL_X,
                    bottom: 0,
                    height: '50%',
                    width: LINE_WIDTH,
                    background: DEFAULT_COLORS.SUCCESS,
                    transform: 'translateX(-50%)',
                    borderRadius: 2,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.25 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#0B1F33' }}>{item.name}</div>
              <div style={{ color: '#5B6B7C', marginTop: 2, fontSize: 12 }}>
                <TimeAgo date={item.creationTime} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryTimeLine;
