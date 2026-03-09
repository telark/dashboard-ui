import React, { useMemo } from 'react';
import { Empty } from 'antd';
import type { PageLayoutConfig } from '../../../../../interfaces/layout/page';
import { ROLES_CONSTANTS as RC } from '../../constants';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
import { useCategories } from '../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { Columns } from '../../components/display/list/Columns';
import { RoleActionsColumn } from '../../components/display/list/RoleActionsColumn';
import { useRoleListConfig } from '../../config/roleListConfig';
import type { Role } from '../../models';
import { useUsers } from '../../../users/hooks';

const RoleIcon = Icons.Role;

interface UseRoleListPageConfigOptions {
  sortKey: string | null;
  handleSort: (key: string) => void;
  sortOrder: 'asc' | 'desc';
  selectedRoles: React.Key[];
  setSelectedRoles: (keys: React.Key[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sortedRoles: Role[];
  paginatedRoles: Role[];
  handleViewRole: (role: Role) => void;
  handleEditRole: (role: Role) => void;
  onCreateRoleClick: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
}

export const useRoleListPageConfig = ({
  sortKey,
  handleSort,
  sortOrder,
  selectedRoles,
  setSelectedRoles,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  sortedRoles,
  paginatedRoles,
  handleViewRole,
  handleEditRole,
  onCreateRoleClick,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: UseRoleListPageConfigOptions): PageLayoutConfig<Role> => {
  const { toolbarConfig } = useRoleListConfig({
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onCreateRoleClick,
  });

  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);
  const { users } = useUsers();

  const ctx = useMemo(
    () => ({
      activeSortKey: (sortKey ?? RC.KEYS.CREATED_AT) as Parameters<typeof Columns>[0]['activeSortKey'],
      onSort: handleSort as Parameters<typeof Columns>[0]['onSort'],
      sortOrder,
      categories: categories ?? [],
      users: users ?? [],
    }),
    [sortKey, handleSort, sortOrder, categories, users],
  );

  const roleColumns = useMemo(() => Columns(ctx), [ctx]);

  return useMemo(
    () => ({
      title: RC.LABELS.HEADER_TITLE,
      subtitle: RC.LABELS.HEADER_SUBTITLE,
      breadcrumbs: [],
      toolbar: toolbarConfig,
      columns: [
        ...roleColumns,
        {
          title: '',
          key: RC.KEYS.ACTIONS,
          align: 'right' as const,
          width: 120,
          onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.BACKGROUND_WHITE } }),
          render: (_: unknown, record: Role) => (
            <RoleActionsColumn
              record={record}
              onView={handleViewRole}
              onEdit={handleEditRole}
            />
          ),
        },
      ],
      data: paginatedRoles,
      rowKey: (record: Role) => record.id,
      containerStyle: { marginTop: '0', paddingBottom: '48px' },
      pagination: {
        currentPage,
        pageSize,
        total: sortedRoles.length,
        onPageChange: (page: number) => setCurrentPage(page),
        onPageSizeChange: (size: number) => {
          setPageSize(size);
          setCurrentPage(1);
        },
        pageSizeOptions: [10, 20, 50, 100],
        showRowsLabel: 'Show rows',
      },
      rowSelection: {
        selectedRowKeys: selectedRoles,
        onChange: (keys: React.Key[]) => setSelectedRoles(keys),
      },
      onRowClick: (record: Role) => handleViewRole(record),
      rowHeight: RC.SIZES.ROW_HEIGHT,
      empty: (
        <Empty
          description="No roles found"
          image={
            <RoleIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginTop: 22 }} />
          }
        />
      ),
    }),
    [
      toolbarConfig,
      roleColumns,
      paginatedRoles,
      currentPage,
      pageSize,
      sortedRoles.length,
      selectedRoles,
      handleViewRole,
      handleEditRole,
      setCurrentPage,
      setPageSize,
      setSelectedRoles,
    ],
  );
};
