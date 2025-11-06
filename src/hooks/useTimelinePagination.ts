import { useState, useEffect, useCallback } from 'react';
import type { Record } from '../interfaces/shared';

export interface TimelinePaginationState {
  visibleItems: Record[];
  isLoading: boolean;
  currentPage: number;
  hasMoreItems: boolean;
}

const ITEMS_PER_PAGE = 20;
const LOADING_DELAY = 100;
const LOAD_MORE_DELAY = 150;

/**
 * Hook for managing timeline pagination in the drawer
 */
export const useTimelinePagination = (
  showFull: boolean,
  items: Record[],
): TimelinePaginationState & { loadMoreItems: () => void } => {
  const [visibleItems, setVisibleItems] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

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
      }, LOADING_DELAY);

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

      setVisibleItems((prev) => [...prev, ...newItems]);
      setCurrentPage(nextPage);
      setIsLoading(false);
    }, LOAD_MORE_DELAY);

    return () => clearTimeout(timer);
  }, [currentPage, items, isLoading]);

  const hasMoreItems = currentPage * ITEMS_PER_PAGE < items.length;

  return {
    visibleItems,
    isLoading,
    currentPage,
    hasMoreItems,
    loadMoreItems,
  };
};

