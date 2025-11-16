import { useMemo } from 'react';
import type { Record } from '../../interfaces/shared';
import type { TimelineData } from '../../interfaces/layout/timeline';

const INITIAL_DISPLAY_COUNT = 5;

export const useTimelineData = (records: Record[] | undefined): TimelineData => {
  return useMemo(() => {
    if (!records || records.length === 0) {
      return { items: [], hasMore: false, displayItems: [] };
    }

    // Sort only once and cache the result
    const sortedItems = [...records].sort(
      (a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime(),
    );

    const hasMoreItems = sortedItems.length > INITIAL_DISPLAY_COUNT;
    const displayItemsOnly = hasMoreItems ? sortedItems.slice(-INITIAL_DISPLAY_COUNT) : sortedItems;

    return {
      items: sortedItems,
      hasMore: hasMoreItems,
      displayItems: displayItemsOnly,
    };
  }, [records]);
};

