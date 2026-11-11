import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Empty, type TableColumnType } from 'antd';
import type { PageLayoutConfig } from '../../../../../interfaces/layout/page';
import type { FilterChip } from '../../../../../interfaces/layout/toolbar';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import { DEFAULT_COLORS } from '../../../../../constants';
import { Icons } from '../../../../../constants';
import { selectGroupsCategories } from '../../../categories/store/selectors/categorySelectors';
import Columns from '../../components/display/list/Columns';
import { generateActionsColumn } from '../../../../../components/display/table/utils';
import { GroupActionsColumn } from '../../components/display/list/GroupActionsColumn';
import { useGroupListConfig } from '../../config/groupListConfig';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import { deduplicateCategoriesByName } from '../../../categories/utils/helpers';
import { useUsers } from '../../../users/hooks';
import { useUsernamesByIds } from '../../../../../hooks/useUsernamesByIds';
import type { Group } from '../../models';

const GroupIcon = Icons.Group;

// Table props stay stable (PageLayout re-renders the table only when one changes), so opening a
// panel, which re-renders this page, leaves the table alone.
const rowKey = (record: Group) => record.id;
const GROUPS_EMPTY = (
  <Empty
    description={GC.LABELS.EMPTY.NO_GROUPS_FOUND}
    // Off scale, kept exact: marginTop 22 (XL to XXL).
    image={<GroupIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginTop: 22 }} />}
  />
);

interface UseGroupListPageConfigOptions {
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
  handleViewGroup: (group: Group) => void;
  handleEditClick: (group: Group) => void;
  onCreateGroupClick: () => void;
  canCreateGroup?: boolean;
  onAddCategoryClick?: () => void;
  selectedGroupsCount?: number;
  onBulkDeleteClick?: () => void;
  onAttachRoleClick?: () => void;
  onAttachMemberClick?: () => void;
  onFilterClick?: () => void;
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

export const useGroupListPageConfig = ({
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
  handleViewGroup,
  handleEditClick,
  onCreateGroupClick,
  canCreateGroup = true,
  onAddCategoryClick,
  selectedGroupsCount = 0,
  onBulkDeleteClick,
  onAttachRoleClick,
  onAttachMemberClick,
  onFilterClick,
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
}: UseGroupListPageConfigOptions): PageLayoutConfig<Group> => {
  const reduxCategories = useSelector(selectGroupsCategories);
  const { users } = useUsers();

  const uniqueReduxCategories = useMemo(
    () => deduplicateCategoriesByName(reduxCategories),
    [reduxCategories],
  );

  const canAddRole = usePermission(
    ACTION_PERMISSIONS.groups.attachRole.scope,
    ACTION_PERMISSIONS.groups.attachRole.level,
    ACTION_PERMISSIONS.groups.attachRole.deny,
  );
  const canRemoveRole = usePermission(
    ACTION_PERMISSIONS.groups.removeRole.scope,
    ACTION_PERMISSIONS.groups.removeRole.level,
    ACTION_PERMISSIONS.groups.removeRole.deny,
  );
  const canAddMember = usePermission(
    ACTION_PERMISSIONS.groups.attachMember.scope,
    ACTION_PERMISSIONS.groups.attachMember.level,
    ACTION_PERMISSIONS.groups.attachMember.deny,
  );
  const canRemoveMember = usePermission(
    ACTION_PERMISSIONS.groups.removeMember.scope,
    ACTION_PERMISSIONS.groups.removeMember.level,
    ACTION_PERMISSIONS.groups.removeMember.deny,
  );
  const canBulkDeleteGroup = usePermission(
    ACTION_PERMISSIONS.groups.delete.scope,
    ACTION_PERMISSIONS.groups.delete.level,
    ACTION_PERMISSIONS.groups.delete.deny,
  );
  // The panels gate each row on its add or remove rule, so either one opens them.
  const canAttachRole = canAddRole || canRemoveRole;
  const canAttachMember = canAddMember || canRemoveMember;
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
  const { listToolbar } = useGroupListConfig({
    onCreateGroupClick,
    canCreateGroup,
    onAddCategoryClick,
    selectedGroupsCount,
    onBulkDeleteClick,
    onAttachRoleClick,
    onAttachMemberClick,
    canAttachRole,
    canAttachMember,
    canBulkDeleteGroup,
    canViewGroupCategories,
    canAddGroupCategory,
    onFilterClick,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    totalCount: sortedGroups.length,
    pageCount: paginatedGroups.length,
    bulkMode,
    onToggleBulkMode,
    filterChips,
    overflowChipsCount,
    onRemoveFilterChip,
    hasActiveFilters,
    onClearAllFilters,
  });

  const actorIds = useMemo(
    () =>
      sortedGroups
        .flatMap((group) => [group.createdBy, group.lastUpdatedBy])
        .filter((id): id is string => Boolean(id)),
    [sortedGroups],
  );
  const usernamesById = useUsernamesByIds(actorIds, true);

  const groupColumns = useMemo(
    () =>
      Columns({
        activeSortKey: sortKey ?? 'creationDate',
        onSort: handleSort,
        categories: uniqueReduxCategories,
        users: users || [],
        usernamesById,
      }) as TableColumnType<Group>[],
    [sortKey, uniqueReduxCategories, handleSort, users, usernamesById],
  );

  const columns = useMemo(
    () => [
      ...groupColumns,
      generateActionsColumn<Group>(GC.KEYS.ACTIONS, GC.SIZES.COLUMNS.ACTIONS, (record) => (
        <GroupActionsColumn record={record} onEdit={handleEditClick} />
      )),
    ],
    [groupColumns, handleEditClick],
  );

  const data = useMemo(
    () => paginatedGroups.filter((item): item is Group => item != null),
    [paginatedGroups],
  );

  const rowSelection = useMemo(
    () =>
      bulkMode
        ? {
            selectedRowKeys: selectedGroups,
            onChange: (keys: React.Key[]) => {
              setSelectedGroups(keys);
            },
          }
        : undefined,
    [bulkMode, selectedGroups, setSelectedGroups],
  );

  return useMemo(
    () => ({
      title: GC.LABELS.HEADER_TITLE,
      subtitle: GC.LABELS.HEADER_SUBTITLE,
      listToolbar,
      columns,
      data,
      rowKey,
      pagination: {
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
      },
      rowSelection,
      onRowClick: handleViewGroup,
      empty: GROUPS_EMPTY,
    }),
    [
      listToolbar,
      columns,
      data,
      currentPage,
      pageSize,
      sortedGroups.length,
      rowSelection,
      handleViewGroup,
      setCurrentPage,
      setPageSize,
    ],
  );
};
