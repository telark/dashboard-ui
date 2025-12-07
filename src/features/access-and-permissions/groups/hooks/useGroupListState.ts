import React from 'react';
import { useState, useMemo } from 'react';
import type { Group } from '../models';

export type SortKey = 'name' | 'categoryID' | 'creationDate';
export type SortOrder = 'asc' | 'desc';

interface UseGroupListStateReturn {
  sortKey: SortKey;
  sortOrder: SortOrder;
  selectedGroups: React.Key[];
  selectedCategory: string;
  currentPage: number;
  pageSize: number;
  setSortKey: (key: SortKey) => void;
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
  const [sortKey, setSortKey] = useState<SortKey>('creationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedGroups, setSelectedGroups] = useState<React.Key[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const handleSort = (key: string) => {
    const sortKeyValue = key as SortKey;
    setSortKey(sortKeyValue);
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Filter by category
  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    if (selectedCategory === 'all') return groups;
    return groups.filter((group) => group.categoryID === selectedCategory);
  }, [groups, selectedCategory]);

  // Sort groups
  const sortedGroups = useMemo(() => {
    const items = [...filteredGroups];
    const compare = (a: Group, b: Group) => {
      switch (sortKey) {
        case 'name':
          return String(a.name).localeCompare(String(b.name));
        case 'categoryID':
          return String(a.categoryID).localeCompare(String(b.categoryID));
        case 'creationDate':
        default:
          return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      }
    };
    items.sort((a, b) => (sortOrder === 'asc' ? compare(a, b) : -compare(a, b)));
    return items;
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
