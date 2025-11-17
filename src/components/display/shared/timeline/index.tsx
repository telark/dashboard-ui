import React, { useState } from 'react';
import { Button } from 'antd';
import type { HistoryInterface } from '../../../../interfaces/shared';
import { TimelineView } from './TimelineView';
import { TimelineDrawer } from './TimelineDrawer';
import { useTimelineData, useTimelinePagination } from '../../../../hooks/layout';
import { DEFAULT_COLORS } from '../../../../constants';

const HistoryTimeLine: React.FC<HistoryInterface> = React.memo(function HistoryTimeLine({
  Records,
}) {
  const { items, hasMore, displayItems } = useTimelineData(Records);
  const [showFull, setShowFull] = useState(false);
  const { visibleItems, isLoading, hasMoreItems, loadMoreItems } = useTimelinePagination(
    showFull,
    items,
  );

  return (
    <>
      <TimelineView items={displayItems} withRecording={true} />
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

      <TimelineDrawer
        open={showFull}
        onClose={() => setShowFull(false)}
        visibleItems={visibleItems}
        isLoading={isLoading}
        hasMoreItems={hasMoreItems}
        totalItems={items.length}
        onLoadMore={loadMoreItems}
      />
    </>
  );
});

export default HistoryTimeLine;
