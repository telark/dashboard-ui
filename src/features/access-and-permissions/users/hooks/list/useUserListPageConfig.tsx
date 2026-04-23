import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Empty } from 'antd';
import type { PageLayoutConfig } from '../../../../../interfaces/layout/page';
import { USERS_CONSTANTS as UC } from '../../constants';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
import type { RootState } from '../../../../../store';
import { useAppearance } from '../../../../../features/settings/sections/appearance';
import { useFetchGroups } from '../../../groups/hooks';
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
}: UseUserListPageConfigOptions): PageLayoutConfig<User> => {
  const { rowHeight } = useAppearance();
  const canManageRole = usePermission(
    ACTION_PERMISSIONS.users.manageRoles.scope,
    ACTION_PERMISSIONS.users.manageRoles.level,
    ACTION_PERMISSIONS.users.manageRoles.deny,
  );
  const canManageGroup = usePermission(
    ACTION_PERMISSIONS.users.manageGroups.scope,
    ACTION_PERMISSIONS.users.manageGroups.level,
    ACTION_PERMISSIONS.users.manageGroups.deny,
  );
  const canBulkDeleteUser = usePermission(
    ACTION_PERMISSIONS.users.delete.scope,
    ACTION_PERMISSIONS.users.delete.level,
    ACTION_PERMISSIONS.users.delete.deny,
  );
  const { toolbarConfig } = useUserListConfig({
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
  });

  useFetchGroups();
  const groups = useSelector((state: RootState) => state.groups.groups);

  const ctx = useMemo(
    () => ({ activeSortKey: sortKey ?? UC.KEYS.CREATION_DATE, onSort: handleSort }),
    [sortKey, handleSort],
  );

  const userColumns = useMemo(() => Columns(ctx, groups), [ctx, groups]);

  return useMemo(
    () => ({
      title: UC.LABELS.HEADER_TITLE,
      subtitle: UC.LABELS.HEADER_SUBTITLE,
      breadcrumbs: [],
      toolbar: toolbarConfig,
      columns: [
        ...userColumns,
        {
          title: '',
          key: UC.KEYS.ACTIONS,
          align: 'right' as const,
          width: 120,
          onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.BACKGROUND_WHITE } }),
          render: (_: unknown, record: User) => (
            <UserActionsColumn record={record} onEdit={handleEditUser} />
          ),
        },
      ],
      data: paginatedUsers,
      rowKey: (record: User) => record.id,
      containerStyle: { marginTop: '0', paddingBottom: '48px' },
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
      rowSelection: {
        selectedRowKeys: selectedUsers,
        onChange: (keys: React.Key[]) => setSelectedUsers(keys),
      },
      onRowClick: (record: User) => handleViewUser(record),
      rowHeight,
      empty: (
        <Empty
          description={UC.LABELS.EMPTY.NO_USERS_FOUND}
          image={<UserIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginTop: 22 }} />}
        />
      ),
    }),
    [
      toolbarConfig,
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
      rowHeight,
    ],
  );
};
