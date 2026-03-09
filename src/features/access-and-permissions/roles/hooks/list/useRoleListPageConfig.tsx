import React, { useMemo, useState } from 'react';
import { Empty } from 'antd';
import type { PageLayoutConfig } from '../../../../../interfaces/layout/page';
import { ROLES_CONSTANTS as RC } from '../../constants';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
import { useCategories } from '../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { useCategoryListView } from '../../../categories/hooks';
import CategoryColumns from '../../../categories/components/display/list/CategoryColumns';
import { CategoryActionsColumn } from '../../../categories/components/display/list/CategoryActionsColumn';
import { Columns } from '../../components/display/list/Columns';
import { RoleActionsColumn } from '../../components/display/list/RoleActionsColumn';
import { useRoleListConfig } from '../../config/roleListConfig';
import type { Role } from '../../models';
import type { Category } from '../../../categories/models';
import { useUsers } from '../../../users/hooks';

const RoleIcon = Icons.Role;

type ViewMode = 'roles' | 'categories';

interface UseRoleListPageConfigOptions {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  categories: Category[];
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
  onFilterClick?: () => void;
  onAddCategoryClick?: () => void;
  onEditCategory?: (category: Category) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
}

export const useRoleListPageConfig = ({
  viewMode,
  setViewMode,
  categories: roleCategories,
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
  onFilterClick,
  onAddCategoryClick,
  onEditCategory,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: UseRoleListPageConfigOptions): PageLayoutConfig<Role | Category> => {
  const [selectedCategories, setSelectedCategories] = useState<React.Key[]>([]);

  const {
    sortKey: categorySortKey,
    currentPage: categoryCurrentPage,
    pageSize: categoryPageSize,
    setCurrentPage: setCategoryCurrentPage,
    setPageSize: setCategoryPageSize,
    handleSort: handleCategorySort,
    sortedCategories,
    paginatedCategories,
  } = useCategoryListView({ categories: roleCategories });

  const { toolbarConfig } = useRoleListConfig({
    viewMode,
    onViewModeChange: setViewMode,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onCreateRoleClick,
    onFilterClick,
    onAddCategoryClick,
  });

  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);
  const { users } = useUsers();

  const ctx = useMemo(
    () => ({
      activeSortKey: (sortKey ?? RC.KEYS.CREATED_AT) as Parameters<
        typeof Columns
      >[0]['activeSortKey'],
      onSort: handleSort as Parameters<typeof Columns>[0]['onSort'],
      sortOrder,
      categories: categories ?? [],
      users: users ?? [],
    }),
    [sortKey, handleSort, sortOrder, categories, users],
  );

  const roleColumns = useMemo(() => Columns(ctx), [ctx]);

  const categoryColumns = useMemo(
    () =>
      CategoryColumns({
        activeSortKey: (categorySortKey ?? 'creationDate') as string,
        onSort: handleCategorySort as (key: string) => void,
      }),
    [categorySortKey, handleCategorySort],
  );

  const breadcrumbs = useMemo(() => {
    if (viewMode === 'categories') {
      return [
        { label: RC.LABELS.HEADER_TITLE, onClick: () => setViewMode('roles') },
        { label: RC.LABELS.BREADCRUMBS.CATEGORIES },
      ];
    }
    return [];
  }, [viewMode]);

  return useMemo(
    () => ({
      title: RC.LABELS.HEADER_TITLE,
      subtitle: RC.LABELS.HEADER_SUBTITLE,
      breadcrumbs,
      toolbar: toolbarConfig,
      columns:
        viewMode === 'roles'
          ? [
              ...roleColumns,
              {
                title: '',
                key: RC.KEYS.ACTIONS,
                align: 'right' as const,
                width: 120,
                onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.BACKGROUND_WHITE } }),
                render: (_: unknown, record: Role | Category) => (
                  <RoleActionsColumn record={record as Role} onEdit={handleEditRole} />
                ),
              },
            ]
          : [
              ...categoryColumns,
              {
                title: '',
                key: 'actions',
                align: 'right' as const,
                width: 120,
                onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.BACKGROUND_WHITE } }),
                render: (_: unknown, record: Role | Category) => (
                  <CategoryActionsColumn
                    record={record as Category}
                    onEdit={onEditCategory}
                  />
                ),
              },
            ],
      data: (viewMode === 'roles' ? paginatedRoles : paginatedCategories) as (Role | Category)[],
      rowKey: (record: Role | Category) => record.id,
      containerStyle: { marginTop: '0', paddingBottom: '48px' },
      pagination:
        viewMode === 'roles'
          ? {
              currentPage,
              pageSize,
              total: sortedRoles.length,
              onPageChange: (page: number) => setCurrentPage(page),
              onPageSizeChange: (size: number) => {
                setPageSize(size);
                setCurrentPage(1);
              },
              pageSizeOptions: [10, 20, 50, 100],
              showRowsLabel: RC.LABELS.PAGINATION.SHOW_ROWS,
            }
          : {
              currentPage: categoryCurrentPage,
              pageSize: categoryPageSize,
              total: sortedCategories.length,
              onPageChange: (page: number) => setCategoryCurrentPage(page),
              onPageSizeChange: (size: number) => {
                setCategoryPageSize(size);
                setCategoryCurrentPage(1);
              },
              pageSizeOptions: [10, 20, 50, 100],
              showRowsLabel: RC.LABELS.PAGINATION.SHOW_ROWS,
            },
      rowSelection:
        viewMode === 'roles'
          ? {
              selectedRowKeys: selectedRoles,
              onChange: (keys: React.Key[]) => setSelectedRoles(keys),
            }
          : {
              selectedRowKeys: selectedCategories,
              onChange: (keys: React.Key[]) => setSelectedCategories(keys),
            },
      onRowClick:
        viewMode === 'roles'
          ? (record: Role | Category) => handleViewRole(record as Role)
          : undefined,
      rowHeight: RC.SIZES.ROW_HEIGHT,
      empty: (
        <Empty
          description={
            viewMode === 'roles'
              ? RC.LABELS.EMPTY.NO_ROLES_FOUND
              : RC.LABELS.EMPTY.NO_CATEGORIES_FOUND
          }
          image={
            <RoleIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginTop: 22 }} />
          }
        />
      ),
    }),
    [
      breadcrumbs,
      toolbarConfig,
      viewMode,
      roleColumns,
      categoryColumns,
      paginatedRoles,
      paginatedCategories,
      currentPage,
      pageSize,
      sortedRoles.length,
      categoryCurrentPage,
      categoryPageSize,
      sortedCategories.length,
      selectedRoles,
      selectedCategories,
      setViewMode,
      handleViewRole,
      handleEditRole,
      setCurrentPage,
      setPageSize,
      setSelectedRoles,
      setCategoryCurrentPage,
      setCategoryPageSize,
    ],
  );
};
