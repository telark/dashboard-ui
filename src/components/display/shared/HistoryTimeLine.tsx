import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Drawer, Button, Spin } from 'antd';
import { HistoryInterface, Record } from '../../../interfaces/common';
import { DEFAULT_COLORS } from '../../../constants';
import TimeAgo from '../../time/TimeAgo';
import { UI } from '../../../constants';

// Visual constants
const PADDING_LEFT = 42;
const HEADER_LEFT_PADDING = 16; // antd Drawer default left padding
const RAIL_X = 18;
const MARKER_SIZE = UI.HISTORY.TIMELINE.MARKER_SIZE;
const LINE_WIDTH = UI.HISTORY.TIMELINE.RAIL_WIDTH;
const GAP_AROUND = 6;
const HALO_SIZE = UI.HISTORY.TIMELINE.HALO_SIZE_LAST; // last item halo size

const capitalizeFirst = (text: string): string =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

const HistoryTimeLine: React.FC<HistoryInterface> = React.memo(({ Records }) => {
  // Optimize: Only process what we need to display initially
  const { items, hasMore, displayItems } = useMemo(() => {
    if (!Records || Records.length === 0) {
      return { items: [], hasMore: false, displayItems: [] };
    }

    // Sort only once and cache the result
    const sortedItems = [...Records].sort(
      (a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime(),
    );

    const hasMoreItems = sortedItems.length > 5;
    const displayItemsOnly = hasMoreItems ? sortedItems.slice(-5) : sortedItems;

    return {
      items: sortedItems,
      hasMore: hasMoreItems,
      displayItems: displayItemsOnly,
    };
  }, [Records]);

  const [showFull, setShowFull] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const ITEMS_PER_PAGE = 20; // Load 20 items at a time

  // Lazy load items when drawer opens
  useEffect(() => {
    if (showFull && items.length > 0) {
      setIsLoading(true);
      // Simulate async loading with a small delay
      const timer = setTimeout(() => {
        const initialItems = items.slice(0, ITEMS_PER_PAGE);
        setVisibleItems(initialItems);
        setCurrentPage(1);
        setIsLoading(false);
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (!showFull) {
      // Reset when drawer closes
      setVisibleItems([]);
      setCurrentPage(0);
    }
  }, [showFull, items]);

  const loadMoreItems = useCallback(() => {
    if (isLoading) return;
    
    setIsLoading(true);
    const timer = setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = nextPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newItems = items.slice(startIndex, endIndex);
      
      setVisibleItems(prev => [...prev, ...newItems]);
      setCurrentPage(nextPage);
      setIsLoading(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [currentPage, items, isLoading]);

  const hasMoreItems = currentPage * ITEMS_PER_PAGE < items.length;

  const markerLeft = -(PADDING_LEFT - RAIL_X);
  const cutHeight = MARKER_SIZE / 2 + GAP_AROUND;

  const renderTimeline = useCallback((list: Record[], withRecording: boolean) => {
    const lastIndex = list.length - 1;
    return (
      <div style={{ position: 'relative', paddingLeft: PADDING_LEFT }}>
        {/* Continuous rail */}
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

        {/* Top mask (no rail above first marker) */}
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
          {list.map((item: Record, idx: number) => {
            const isLast = idx === lastIndex;
            const isError = /error|failed|fail|danger/i.test(item.status);
            const maskHeight = isLast ? HALO_SIZE + 4 : MARKER_SIZE + GAP_AROUND * 2;
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
                    {capitalizeFirst(item.name)}
                  </div>
                  <div style={{ color: '#5B6B7C', marginTop: 4, fontSize: 13 }}>
                    <TimeAgo date={item.creationTime} />
                  </div>
                </div>
              </div>
            );
          })}

          {withRecording && (
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
          )}
        </div>

        {/* Bottom mask so rail doesn't extend beyond the last row / spinner */}
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
  }, [markerLeft, cutHeight]);

  return (
    <>
      {renderTimeline(displayItems, true)}

      {hasMore && (
        <div style={{ marginTop: 12 }}>
          <Button
            onClick={() => setShowFull(true)}
            style={{
              borderColor: DEFAULT_COLORS.SUCCESS,
              color: DEFAULT_COLORS.SUCCESS,
              borderWidth: 1,
              borderRadius: 12,
              height: 36,
            }}
          >
            Show Full History
          </Button>
        </div>
      )}

      <Drawer
        title={
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: PADDING_LEFT - HEADER_LEFT_PADDING,
            }}
          >
            <span style={{ fontWeight: 700, color: '#0B1F33' }}>{UI.HISTORY.FULL_TITLE}</span>
            <span
              onClick={() => setShowFull(false)}
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#6b7280',
                display: 'inline-flex',
              }}
              aria-label="Close"
            >
              <CloseOutlined />
            </span>
          </div>
        }
        closable={false}
        placement="right"
        width={420}
        open={showFull}
        onClose={() => setShowFull(false)}
        styles={{ body: { padding: 16 }, header: { borderBottom: 'none', padding: '12px 16px' } }}
      >
        {isLoading && visibleItems.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {renderTimeline(visibleItems, false)}
            {hasMoreItems && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button
                  onClick={loadMoreItems}
                  loading={isLoading}
                  style={{
                    borderColor: DEFAULT_COLORS.SUCCESS,
                    color: DEFAULT_COLORS.SUCCESS,
                    borderWidth: 1,
                    borderRadius: 12,
                    height: 36,
                  }}
                >
                  {isLoading 
                    ? 'Loading...' 
                    : `Load More (${items.length - visibleItems.length} remaining)`
                  }
                </Button>
              </div>
            )}
          </>
        )}
      </Drawer>
    </>
  );
});

export default HistoryTimeLine;
