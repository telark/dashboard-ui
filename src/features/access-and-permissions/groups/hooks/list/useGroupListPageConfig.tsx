import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Empty } from 'antd';
import type { PageLayoutConfig } from '../../../../../interfaces/layout/page';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import { DEFAULT_COLORS } from '../../../../../constants';
import { Icons } from '../../../../../constants';
import { useAppearance } from '../../../../../features/settings/sections/appearance';
import { selectGroupsCategories } from '../../../categories/store/selectors/categorySelectors';
import Columns from '../../components/display/list/Columns';
import CategoryColumns from '../../../categories/components/display/list/CategoryColumns';
import { CategoryActionsColumn } from '../../../categories/components/display/list/CategoryActionsColumn';
import { GroupActionsColumn } from '../../components/display/list/GroupActionsColumn';
import { useGroupListConfig } from '../../config/groupListConfig';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import { useCategoryListView } from '../../../categories/hooks';
import { deduplicateCategoriesByName } from '../../../categories/utils/helpers';
import { useUsers } from '../../../users/hooks';
import type { Group } from '../../models';
import type { Category } from '../../../categories/models';

const GroupIcon = Icons.Group;

type ViewMode = 'groups' | 'categories';

interface UseGroupListPageConfigOptions {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortKey: string | null;
  handleSort: (key: string) => void;
  selectedGroups: React.Key[];
  setSelectedGroups: (keys: React.Key[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sortedGroups: Group[];
  paginatedGroups: Group[];
  hasSelection: boolean;
  handleViewGroup: (group: Group) => void;
  handleEditClick: (group: Group) => void;
  onCreateGroupClick: () => void;
  canCreateGroup?: boolean;
  onAddCategoryClick?: () => void;
  onEditCategory?: (category: Category) => void;
  categories: Category[] | undefined;
  selectedGroupsCount?: number;
  onBulkDeleteClick?: () => void;
  onAttachRoleClick?: () => void;
  onAttachMemberClick?: () => void;
  onFilterClick?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
}

export const useGroupListPageConfig = ({
  viewMode,
  setViewMode,
  categories,
  sortKey,
  handleSort,
  selectedGroups,
  setSelectedGroups,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  sortedGroups,
  paginatedGroups,
  hasSelection,
  handleViewGroup,
  handleEditClick,
  onCreateGroupClick,
  canCreateGroup = true,
  onAddCategoryClick,
  onEditCategory,
  selectedGroupsCount = 0,
  onBulkDeleteClick,
  onAttachRoleClick,
  onAttachMemberClick,
  onFilterClick,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: UseGroupListPageConfigOptions): PageLayoutConfig<Group | Category> => {
  const [selectedCategories, setSelectedCategories] = useState<React.Key[]>([]);
  const { rowHeight } = useAppearance();
  const reduxCategories = useSelector(selectGroupsCategories);
  const { users } = useUsers();

  const uniqueReduxCategories = useMemo(
    () => deduplicateCategoriesByName(reduxCategories),
    [reduxCategories],
  );

  const uniqueCategories = useMemo(
    () => deduplicateCategoriesByName(categories || []),
    [categories],
  );

  const {
    sortKey: categorySortKey,
    currentPage: categoryCurrentPage,
    pageSize: categoryPageSize,
    setCurrentPage: setCategoryCurrentPage,
    setPageSize: setCategoryPageSize,
    handleSort: handleCategorySort,
    sortedCategories,
    paginatedCategories,
  } = useCategoryListView({ categories: uniqueCategories });

  const canAttachRole = usePermission(
    ACTION_PERMISSIONS.groups.attachRole.scope,
    ACTION_PERMISSIONS.groups.attachRole.level,
    ACTION_PERMISSIONS.groups.attachRole.deny,
  );
  const canAttachMember = usePermission(
    ACTION_PERMISSIONS.groups.attachMember.scope,
    ACTION_PERMISSIONS.groups.attachMember.level,
    ACTION_PERMISSIONS.groups.attachMember.deny,
  );
  const canViewGroupCategories = usePermission(
    ACTION_PERMISSIONS.groups.viewCategories.scope,
    ACTION_PERMISSIONS.groups.viewCategories.level,
    ACTION_PERMISSIONS.groups.viewCategories.deny,
  );
  const canAddGroupCategory = usePermission(
    ACTION_PERMISSIONS.groups.addCategory.scope,
    ACTION_PERMISSIONS.groups.addCategory.level,
    ACTION_PERMISSIONS.groups.addCategory.deny,
  );
  const { toolbarConfig } = useGroupListConfig({
    viewMode,
    onViewModeChange: setViewMode,
    onCreateGroupClick,
    canCreateGroup,
    onAddCategoryClick,
    selectedGroupsCount,
    onBulkDeleteClick,
    onAttachRoleClick,
    onAttachMemberClick,
    canAttachRole,
    canAttachMember,
    canViewGroupCategories,
    canAddGroupCategory,
    onFilterClick,
    searchValue,
    onSearchChange,
    onSearchSubmit,
  });

  const groupColumns = useMemo(
    () =>
      Columns({
        activeSortKey: sortKey ?? 'creationDate',
        onSort: handleSort,
        categories: uniqueReduxCategories,
        users: users || [],
      }),
    [sortKey, uniqueReduxCategories, handleSort, users],
  );

  const categoryColumns = useMemo(
    () =>
      CategoryColumns({
        activeSortKey: categorySortKey ?? 'creationDate',
        onSort: handleCategorySort,
      }),
    [categorySortKey, handleCategorySort],
  );

  const breadcrumbs = useMemo(() => {
    if (viewMode === 'categories') {
      return [
        { label: GC.LABELS.BREADCRUMBS.GROUPS, onClick: () => setViewMode('groups') },
        { label: GC.LABELS.BREADCRUMBS.CATEGORIES },
      ];
    }
    return [];
  }, [viewMode, setViewMode]);

  return useMemo(
    () => ({
      title: GC.LABELS.HEADER_TITLE,
      subtitle: GC.LABELS.HEADER_SUBTITLE,
      breadcrumbs,
      toolbar: toolbarConfig,
      columns:
        viewMode === 'groups'
          ? [
              ...groupColumns,
              {
                title: '',
                key: 'actions',
                align: 'right' as const,
                width: 120,
                onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.BACKGROUND_WHITE } }),
                render: (_: unknown, record: Group | Category) =>
                  viewMode === 'groups' ? (
                    <GroupActionsColumn record={record as Group} onEdit={handleEditClick} />
                  ) : null,
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
                render: (_: unknown, record: Group | Category) => (
                  <CategoryActionsColumn record={record as Category} onEdit={onEditCategory} scope="groups" />
                ),
              },
            ],
      data: (viewMode === 'groups' ? paginatedGroups : paginatedCategories).filter(
        (item): item is Group | Category => item != null,
      ),
      rowKey: (record: Group | Category) => record.id,
      containerStyle: {
        marginTop: viewMode === 'groups' && hasSelection ? '0' : undefined,
        paddingBottom: '48px',
      },
      pagination:
        viewMode === 'groups'
          ? {
              currentPage,
              pageSize,
              total: sortedGroups.length,
              onPageChange: (page: number) => setCurrentPage(page),
              onPageSizeChange: (size: number) => {
                setPageSize(size);
                setCurrentPage(1);
              },
              pageSizeOptions: [10, 20, 50, 100],
              showRowsLabel: GC.LABELS.PAGINATION.SHOW_ROWS,
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
              showRowsLabel: GC.LABELS.PAGINATION.SHOW_ROWS,
            },
      rowSelection:
        viewMode === 'groups'
          ? {
              selectedRowKeys: selectedGroups,
              onChange: (keys: React.Key[]) => {
                setSelectedGroups(keys);
              },
            }
          : {
              selectedRowKeys: selectedCategories,
              onChange: (keys: React.Key[]) => {
                setSelectedCategories(keys);
              },
            },
      onRowClick:
        viewMode === 'groups'
          ? (record: Group | Category) => handleViewGroup(record as Group)
          : undefined,
      rowHeight,
      empty:
        viewMode === 'groups' ? (
          <Empty
            description={GC.LABELS.EMPTY.NO_GROUPS_FOUND}
            image={
              <GroupIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginTop: 22 }} />
            }
          />
        ) : (
          <Empty
            description={GC.LABELS.EMPTY.NO_CATEGORIES_FOUND}
            image={
              <GroupIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginTop: 22 }} />
            }
          />
        ),
    }),
    [
      breadcrumbs,
      toolbarConfig,
      viewMode,
      groupColumns,
      categoryColumns,
      paginatedGroups,
      paginatedCategories,
      currentPage,
      pageSize,
      sortedGroups.length,
      categoryCurrentPage,
      categoryPageSize,
      sortedCategories.length,
      selectedGroups,
      hasSelection,
      handleViewGroup,
      handleEditClick,
      setCurrentPage,
      setPageSize,
      setCategoryCurrentPage,
      setCategoryPageSize,
      setSelectedGroups,
      selectedCategories,
      setSelectedCategories,
      onEditCategory,
      rowHeight,
    ],
  );
};
