import { useState, useCallback } from 'react';
import type { SortOrder, UseSortStateReturn } from './types';

interface UseSortStateOptions {
  defaultSortKey?: string | null;
  defaultSortOrder?: SortOrder;
}

export const useSortState = (options: UseSortStateOptions = {}): UseSortStateReturn => {
  const { defaultSortKey = null, defaultSortOrder = 'desc' } = options;

  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);

  const handleSort = useCallback(
    (key: string) => {
      if (key === sortKey) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortOrder('asc');
      }
    },
    [sortKey],
  );

  return {
    sortKey,
    sortOrder,
    handleSort,
    setSortKey,
    setSortOrder,
  };
};
