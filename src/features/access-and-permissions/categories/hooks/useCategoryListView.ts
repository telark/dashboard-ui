import { useState, useMemo } from 'react';
import { useSortState, sortData } from '../../../../utils/layout/sort';
import type { SortFieldConfig } from '../../../../utils/layout/sort';
import type { Category } from '../models';

const CATEGORY_SORT_FIELDS: SortFieldConfig<Category>[] = [
  { key: 'name', type: 'string' },
  { key: 'type', type: 'string' },
  { key: 'scope', type: 'string' },
  { key: 'creationDate', type: 'date' },
];

interface UseCategoryListViewProps {
  categories: Category[];
}

export const useCategoryListView = ({ categories }: UseCategoryListViewProps) => {
  const { sortKey, sortOrder, handleSort } = useSortState({
    defaultSortKey: 'creationDate',
    defaultSortOrder: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sortedCategories = useMemo(() => {
    return sortData(categories, sortKey, sortOrder, CATEGORY_SORT_FIELDS);
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
