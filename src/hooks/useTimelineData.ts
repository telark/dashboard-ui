import { useMemo } from 'react';
import type { Record } from '../interfaces/shared';
import { UI } from '../constants';

export interface TimelineData {
  items: Record[];
  hasMore: boolean;
  displayItems: Record[];
}

const INITIAL_DISPLAY_COUNT = 5;

/**
 * Hook for processing timeline records data
 * Handles sorting and initial display logic
 */
export const useTimelineData = (records: Record[] | undefined): TimelineData => {
  // Create a stable dependency key based on records content to avoid unnecessary re-sorting
  const recordsKey = useMemo(() => {
    if (!records || records.length === 0) return '';
    return `${records.length}-${records.map((r) => r.creationTime).join(',')}`;
  }, [records]);

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
  }, [records, recordsKey]);
};
