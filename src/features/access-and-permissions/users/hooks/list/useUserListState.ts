import React, { useState, useMemo } from 'react';
import { useSortState, sortData } from '../../../../../utils/layout/sort';
import type { SortFieldConfig, SortOrder } from '../../../../../utils/layout/sort';
import type { User } from '../../models';

const USER_SORT_FIELDS: SortFieldConfig<User>[] = [
  { key: 'username', type: 'string' },
  { key: 'fullname', type: 'string' },
  { key: 'email', type: 'string' },
  { key: 'roleID', type: 'string' },
  { key: 'creationDate', type: 'date' },
];

interface UseUserListStateReturn {
  sortKey: string | null;
  sortOrder: SortOrder;
  selectedUsers: React.Key[];
  currentPage: number;
  pageSize: number;
  setSelectedUsers: (keys: React.Key[]) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleSort: (key: string) => void;
  sortedUsers: User[];
  paginatedUsers: User[];
  hasSelection: boolean;
}

export const useUserListState = (users: User[]): UseUserListStateReturn => {
  const { sortKey, sortOrder, handleSort } = useSortState({
    defaultSortKey: 'creationDate',
    defaultSortOrder: 'desc',
  });

  const [selectedUsers, setSelectedUsers] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const sortedUsers = useMemo(
    () => sortData(users, sortKey, sortOrder, USER_SORT_FIELDS),
    [users, sortKey, sortOrder],
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  const hasSelection = selectedUsers.length > 0;

  return {
    sortKey,
    sortOrder,
    selectedUsers,
    currentPage,
    pageSize,
    setSelectedUsers,
    setCurrentPage,
    setPageSize,
    handleSort,
    sortedUsers,
    paginatedUsers,
    hasSelection,
  };
};
