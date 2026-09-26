import React, { useCallback, useMemo } from 'react';
import { Empty, type TableColumnType } from 'antd';
import type { PageLayoutConfig } from '../../../../../interfaces/layout/page';
import type { FilterChip } from '../../../../../interfaces/layout/toolbar';
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
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import { canDeleteRole } from '../../utils';
import type { Role } from '../../models';
import type { Category } from '../../../categories/models';
import { useUsers } from '../../../users/hooks';
import { useFetchGroups } from '../../../groups/hooks';

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
  bulkMode: boolean;
  onToggleBulkMode: () => void;
  onBulkDeleteClick: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sortedRoles: Role[];
  paginatedRoles: Role[];
  handleViewRole: (role: Role) => void;
  handleEditRole: (role: Role) => void;
  onCreateRoleClick: () => void;
  canCreateRole?: boolean;
  onFilterClick?: () => void;
  onAddCategoryClick?: () => void;
  onEditCategory?: (category: Category) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  filterChips: FilterChip[];
  overflowChipsCount: number;
  onRemoveFilterChip: (key: string, value: string) => void;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
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
  bulkMode,
  onToggleBulkMode,
  onBulkDeleteClick,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  sortedRoles,
  paginatedRoles,
  handleViewRole,
  handleEditRole,
  onCreateRoleClick,
  canCreateRole = true,
  onFilterClick,
  onAddCategoryClick,
  onEditCategory,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  filterChips,
  overflowChipsCount,
  onRemoveFilterChip,
  hasActiveFilters,
  onClearAllFilters,
}: UseRoleListPageConfigOptions): PageLayoutConfig<Role | Category> => {
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

  const canViewRoleCategories = usePermission(
    ACTION_PERMISSIONS.roles.viewCategories.scope,
    ACTION_PERMISSIONS.roles.viewCategories.level,
    ACTION_PERMISSIONS.roles.viewCategories.deny,
  );
  const canAddRoleCategory = usePermission(
    ACTION_PERMISSIONS.roles.addCategory.scope,
    ACTION_PERMISSIONS.roles.addCategory.level,
    ACTION_PERMISSIONS.roles.addCategory.deny,
  );
  const canBulkDeleteRole = usePermission(
    ACTION_PERMISSIONS.roles.delete.scope,
    ACTION_PERMISSIONS.roles.delete.level,
    ACTION_PERMISSIONS.roles.delete.deny,
  );
  const selectionHasProtectedRole = useMemo(() => {
    const selected = new Set(selectedRoles);
    return sortedRoles.some((role) => selected.has(role.id) && !canDeleteRole(role));
  }, [selectedRoles, sortedRoles]);
  const isRolesView = viewMode === 'roles';
  const { listToolbar } = useRoleListConfig({
    viewMode,
    onViewModeChange: setViewMode,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onCreateRoleClick,
    canCreateRole,
    onFilterClick,
    onAddCategoryClick,
    canViewRoleCategories,
    canAddRoleCategory,
    totalCount: isRolesView ? sortedRoles.length : sortedCategories.length,
    pageCount: paginatedRoles.length,
    selectedRolesCount: selectedRoles.length,
    bulkMode,
    onToggleBulkMode,
    onBulkDeleteClick,
    canBulkDeleteRole,
    selectionHasProtectedRole,
    filterChips,
    overflowChipsCount,
    onRemoveFilterChip,
    hasActiveFilters,
    onClearAllFilters,
  });

  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);
  const { users } = useUsers();
  const { groups } = useFetchGroups();

  const getUsage = useCallback(
    (roleId: string) => ({
      users: users.filter((user) => user.roleRefs?.includes(roleId)).length,
      groups: groups.filter((group) => group.roleRefs?.includes(roleId)).length,
    }),
    [users, groups],
  );

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

  const roleColumns = useMemo(() => Columns(ctx) as TableColumnType<Role | Category>[], [ctx]);

  const categoryColumns = useMemo(
    () =>
      CategoryColumns({
        activeSortKey: (categorySortKey ?? 'creationDate') as string,
        onSort: handleCategorySort as (key: string) => void,
      }) as TableColumnType<Role | Category>[],
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
  }, [viewMode, setViewMode]);

  return useMemo(
    () => ({
      title: RC.LABELS.HEADER_TITLE,
      subtitle: RC.LABELS.HEADER_SUBTITLE,
      breadcrumbs,
      listToolbar,
      columns:
        viewMode === 'roles'
          ? [
              ...roleColumns,
              {
                title: '',
                key: RC.KEYS.ACTIONS,
                align: 'right' as const,
                width: 120,
                onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.PAGE_BG } }),
                render: (_: unknown, record: Role | Category) => (
                  <RoleActionsColumn
                    record={record as Role}
                    onEdit={handleEditRole}
                    getUsage={getUsage}
                  />
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
                onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.PAGE_BG } }),
                render: (_: unknown, record: Role | Category) => (
                  <CategoryActionsColumn
                    record={record as Category}
                    onEdit={onEditCategory}
                    scope="roles"
                  />
                ),
              },
            ],
      data: (viewMode === 'roles' ? paginatedRoles : paginatedCategories) as (Role | Category)[],
      rowKey: (record: Role | Category) => record.id,
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
        isRolesView && bulkMode
          ? {
              selectedRowKeys: selectedRoles,
              onChange: (keys: React.Key[]) => setSelectedRoles(keys),
            }
          : undefined,
      onRowClick:
        viewMode === 'roles'
          ? (record: Role | Category) => handleViewRole(record as Role)
          : undefined,
      empty: (
        <Empty
          description={
            viewMode === 'roles'
              ? RC.LABELS.EMPTY.NO_ROLES_FOUND
              : RC.LABELS.EMPTY.NO_CATEGORIES_FOUND
          }
          image={<RoleIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginTop: 22 }} />}
        />
      ),
    }),
    [
      breadcrumbs,
      listToolbar,
      isRolesView,
      bulkMode,
      selectedRoles,
      setSelectedRoles,
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
      handleViewRole,
      handleEditRole,
      getUsage,
      setCurrentPage,
      setPageSize,
      setCategoryCurrentPage,
      setCategoryPageSize,
      onEditCategory,
    ],
  );
};
