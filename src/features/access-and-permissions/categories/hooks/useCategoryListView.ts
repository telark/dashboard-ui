import { useState, useMemo, useCallback } from 'react';
import type { Category } from '../models';

type SortKey = 'name' | 'type' | 'scope' | 'creationDate';
type SortOrder = 'asc' | 'desc';

interface UseCategoryListViewProps {
  categories: Category[];
}

export const useCategoryListView = ({ categories }: UseCategoryListViewProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('creationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = useCallback((key: string) => {
    if (key === sortKey) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key as SortKey);
      setSortOrder('asc');
    }
  }, [sortKey]);

  const sortedCategories = useMemo(() => {
    const items = [...categories];
    const compare = (a: Category, b: Category) => {
      switch (sortKey) {
        case 'name':
          return String(a.name).localeCompare(String(b.name));
        case 'type':
          return String(a.type).localeCompare(String(b.type));
        case 'scope':
          return String(a.scope).localeCompare(String(b.scope));
        case 'creationDate':
        default:
          return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      }
    };
    items.sort((a, b) => (sortOrder === 'asc' ? compare(a, b) : -compare(a, b)));
    return items;
  }, [categories, sortKey, sortOrder]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedCategories.slice(start, end);
  }, [sortedCategories, currentPage, pageSize]);

  return {
    sortKey,
    sortOrder,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleSort,
    sortedCategories,
    paginatedCategories,
  };
};

