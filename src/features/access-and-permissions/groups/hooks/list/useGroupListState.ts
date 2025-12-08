import React from 'react';
import { useState, useMemo } from 'react';
import { useSortState, sortData } from '../../../../../utils/layout/sort';
import type { SortFieldConfig, SortOrder } from '../../../../../utils/layout/sort';
import type { Group } from '../../models';

const GROUP_SORT_FIELDS: SortFieldConfig<Group>[] = [
  { key: 'name', type: 'string' },
  { key: 'description', type: 'string' },
  { key: 'categoryID', type: 'string' },
  { key: 'creationDate', type: 'date' },
  { key: 'lastUpdateDate', type: 'date' },
];

interface UseGroupListStateReturn {
  sortKey: string | null;
  sortOrder: SortOrder;
  selectedGroups: React.Key[];
  selectedCategory: string;
  currentPage: number;
  pageSize: number;
  setSortKey: (key: string | null) => void;
  setSortOrder: (order: SortOrder) => void;
  setSelectedGroups: (keys: React.Key[]) => void;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleSort: (key: string) => void;
  filteredGroups: Group[];
  sortedGroups: Group[];
  paginatedGroups: Group[];
  selectedCount: number;
  hasSelection: boolean;
}

export const useGroupListState = (groups: Group[] | undefined): UseGroupListStateReturn => {
  const { sortKey, sortOrder, handleSort, setSortKey, setSortOrder } = useSortState({
    defaultSortKey: 'creationDate',
    defaultSortOrder: 'desc',
  });
  const [selectedGroups, setSelectedGroups] = useState<React.Key[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filter by category
  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    if (selectedCategory === 'all') return groups;
    return groups.filter((group) => group.categoryID === selectedCategory);
  }, [groups, selectedCategory]);

  // Sort groups
  const sortedGroups = useMemo(() => {
    return sortData(filteredGroups, sortKey, sortOrder, GROUP_SORT_FIELDS);
  }, [filteredGroups, sortKey, sortOrder]);

  // Paginate groups
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedGroups.slice(start, end);
  }, [sortedGroups, currentPage, pageSize]);

  const selectedCount = selectedGroups.length;
  const hasSelection = selectedCount > 0;

  return {
    sortKey,
    sortOrder,
    selectedGroups,
    selectedCategory,
    currentPage,
    pageSize,
    setSortKey,
    setSortOrder,
    setSelectedGroups,
    setSelectedCategory,
    setCurrentPage,
    setPageSize,
    handleSort,
    filteredGroups,
    sortedGroups,
    paginatedGroups,
    selectedCount,
    hasSelection,
  };
};
