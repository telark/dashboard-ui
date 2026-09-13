import React, { useState, useMemo, useCallback } from 'react';
import { useSortState, sortData } from '../../../../../utils/layout/sort';
import type { SortFieldConfig, SortOrder } from '../../../../../utils/layout/sort';
import type { Role } from '../../models';
import { ROLES_CONSTANTS as RC } from '../../constants';

const ROLE_SORT_FIELDS: SortFieldConfig<Role>[] = [
  { key: RC.KEYS.NAME, type: 'string' },
  { key: RC.KEYS.TYPE, type: 'string' },
  { key: RC.KEYS.STATUS, type: 'string' },
  { key: RC.KEYS.CREATED_AT, type: 'date', getValue: (r) => r.creationDate },
];

export interface UseRoleListStateReturn {
  sortKey: string | null;
  sortOrder: SortOrder;
  selectedRoles: React.Key[];
  setSelectedRoles: (keys: React.Key[]) => void;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleSort: (key: string) => void;
  sortedRoles: Role[];
  paginatedRoles: Role[];
  bulkMode: boolean;
  toggleBulkMode: () => void;
}

export const useRoleListState = (roles: Role[]): UseRoleListStateReturn => {
  const { sortKey, sortOrder, handleSort } = useSortState({
    defaultSortKey: RC.KEYS.CREATED_AT,
    defaultSortOrder: 'desc',
  });

  const [selectedRoles, setSelectedRoles] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bulkMode, setBulkMode] = useState(false);

  const sortedRoles = useMemo(
    () => sortData(roles, sortKey, sortOrder, ROLE_SORT_FIELDS),
    [roles, sortKey, sortOrder],
  );

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRoles.slice(start, start + pageSize);
  }, [sortedRoles, currentPage, pageSize]);

  // Leaving bulk mode hides the selection column, so a selection kept behind it
  // would act on rows the user can no longer see.
  const toggleBulkMode = useCallback(() => {
    if (bulkMode) setSelectedRoles([]);
    setBulkMode(!bulkMode);
  }, [bulkMode]);

  return {
    sortKey,
    sortOrder,
    selectedRoles,
    setSelectedRoles,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleSort,
    sortedRoles,
    paginatedRoles,
    bulkMode,
    toggleBulkMode,
  };
};
