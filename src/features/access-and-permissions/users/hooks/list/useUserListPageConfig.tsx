import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Empty } from 'antd';
import type { PageLayoutConfig } from '../../../../../interfaces/layout/page';
import type { FilterChip } from '../../../../../interfaces/layout/toolbar';
import { USERS_CONSTANTS as UC } from '../../constants';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
import type { RootState } from '../../../../../store';
import { useFetchGroups } from '../../../groups/hooks';
import { useRoles } from '../../../roles/hooks';
import { useUserLockReason } from '../user/useUserLockReason';
import Columns from '../../components/display/list/Columns';
import { UserActionsColumn } from '../../components/display/list/UserActionsColumn';
import { useUserListConfig } from '../../config/userListConfig';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import type { User } from '../../models';

const UserIcon = Icons.User;

interface UseUserListPageConfigOptions {
  sortKey: string | null;
  handleSort: (key: string) => void;
  selectedUsers: React.Key[];
  setSelectedUsers: (keys: React.Key[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sortedUsers: User[];
  paginatedUsers: User[];
  loadFailed: boolean;
  hasSelection: boolean;
  handleViewUser: (user: User) => void;
  handleEditUser: (user: User) => void;
  onCreateUserClick: () => void;
  canCreateUser?: boolean;
  onFilterClick?: () => void;
  onBulkDeleteClick?: () => void;
  onManageRoleClick?: () => void;
  onManageGroupClick?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  bulkMode: boolean;
  onToggleBulkMode: () => void;
  filterChips: FilterChip[];
  overflowChipsCount: number;
  onRemoveFilterChip: (key: string, value: string) => void;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
}

export const useUserListPageConfig = ({
  sortKey,
  handleSort,
  selectedUsers,
  setSelectedUsers,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  sortedUsers,
  paginatedUsers,
  loadFailed,
  handleViewUser,
  handleEditUser,
  onCreateUserClick,
  canCreateUser,
  onFilterClick,
  onBulkDeleteClick,
  onManageRoleClick,
  onManageGroupClick,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  bulkMode,
  onToggleBulkMode,
  filterChips,
  overflowChipsCount,
  onRemoveFilterChip,
  hasActiveFilters,
  onClearAllFilters,
}: UseUserListPageConfigOptions): PageLayoutConfig<User> => {
  const canAssignRole = usePermission(
    ACTION_PERMISSIONS.users.manageRoles.scope,
    ACTION_PERMISSIONS.users.manageRoles.level,
    ACTION_PERMISSIONS.users.manageRoles.deny,
  );
  const canRemoveRole = usePermission(
    ACTION_PERMISSIONS.users.removeRole.scope,
    ACTION_PERMISSIONS.users.removeRole.level,
    ACTION_PERMISSIONS.users.removeRole.deny,
  );
  const canAddToGroup = usePermission(
    ACTION_PERMISSIONS.users.manageGroups.scope,
    ACTION_PERMISSIONS.users.manageGroups.level,
    ACTION_PERMISSIONS.users.manageGroups.deny,
  );
  const canRemoveFromGroup = usePermission(
    ACTION_PERMISSIONS.users.removeFromGroup.scope,
    ACTION_PERMISSIONS.users.removeFromGroup.level,
    ACTION_PERMISSIONS.users.removeFromGroup.deny,
  );
  // The panels gate each row on its add or remove rule, so either one opens them.
  const canManageRole = canAssignRole || canRemoveRole;
  const canManageGroup = canAddToGroup || canRemoveFromGroup;
  const canBulkDeleteUser = usePermission(
    ACTION_PERMISSIONS.users.delete.scope,
    ACTION_PERMISSIONS.users.delete.level,
    ACTION_PERMISSIONS.users.delete.deny,
  );
  const canViewGroups = usePermission(
    ACTION_PERMISSIONS.groups.view.scope,
    ACTION_PERMISSIONS.groups.view.level,
  );
  useRoles();
  const lockReasonFor = useUserLockReason();
  const bulkDeleteLockReason = useMemo(
    () =>
      sortedUsers
        .filter((user) => selectedUsers.includes(user.id))
        .map(lockReasonFor)
        .find(Boolean),
    [sortedUsers, selectedUsers, lockReasonFor],
  );

  const { listToolbar } = useUserListConfig({
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onCreateUserClick,
    canCreateUser,
    selectedUsersCount: selectedUsers.length,
    onFilterClick,
    onBulkDeleteClick,
    onManageRoleClick,
    onManageGroupClick,
    canManageRole,
    canManageGroup,
    canBulkDeleteUser,
    bulkDeleteLockReason,
    // A failed load shows no count rather than "0 members" beside the error.
    totalCount: loadFailed ? undefined : sortedUsers.length,
    pageCount: paginatedUsers.length,
    bulkMode,
    onToggleBulkMode,
    filterChips,
    overflowChipsCount,
    onRemoveFilterChip,
    hasActiveFilters,
    onClearAllFilters,
  });

  useFetchGroups();
  const groups = useSelector((state: RootState) => state.groups.groups);

  const ctx = useMemo(
    () => ({ activeSortKey: sortKey ?? UC.KEYS.CREATION_DATE, onSort: handleSort }),
    [sortKey, handleSort],
  );

  const userColumns = useMemo(
    () => Columns(ctx, groups, canViewGroups),
    [ctx, groups, canViewGroups],
  );

  return useMemo(
    () => ({
      title: UC.LABELS.HEADER_TITLE,
      subtitle: UC.LABELS.HEADER_SUBTITLE,
      breadcrumbs: [],
      listToolbar,
      columns: [
        ...userColumns,
        {
          title: '',
          key: UC.KEYS.ACTIONS,
          align: 'right' as const,
          width: 120,
          onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.PAGE_BG } }),
          render: (_: unknown, record: User) => (
            <UserActionsColumn record={record} onEdit={handleEditUser} />
          ),
        },
      ],
      data: paginatedUsers,
      rowKey: (record: User) => record.id,
      pagination: {
        currentPage,
        pageSize,
        total: sortedUsers.length,
        onPageChange: (page: number) => setCurrentPage(page),
        onPageSizeChange: (size: number) => {
          setPageSize(size);
          setCurrentPage(1);
        },
        pageSizeOptions: [10, 20, 50, 100],
        showRowsLabel: UC.LABELS.PAGINATION.SHOW_ROWS,
      },
      rowSelection: bulkMode
        ? {
            selectedRowKeys: selectedUsers,
            onChange: (keys: React.Key[]) => setSelectedUsers(keys),
          }
        : undefined,
      onRowClick: (record: User) => handleViewUser(record),
      empty: (
        <Empty
          description={UC.LABELS.EMPTY.NO_USERS_FOUND}
          image={<UserIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginTop: 22 }} />}
        />
      ),
    }),
    [
      listToolbar,
      bulkMode,
      userColumns,
      paginatedUsers,
      currentPage,
      pageSize,
      sortedUsers.length,
      selectedUsers,
      handleViewUser,
      handleEditUser,
      setCurrentPage,
      setPageSize,
      setSelectedUsers,
    ],
  );
};
