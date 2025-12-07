import React, { useMemo, useState } from 'react';
import { Activity } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { APP_ROUTES, Icons, SHARED_DETAILS_CONSTANTS } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { PageLayout } from '../../../../components/display/views';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import EmptyState from '../../../../components/display/views/EmptyState';
import { FancySpinner } from '../../../../components/animation';
import { useGroups, useGroupActions, useGroupListState, useGroupListActions } from '../hooks';
import { useCategories, useCategoryListView } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { selectGroupsCategories } from '../../categories/store/selectors/categorySelectors';
import Columns from '../components/display/list/Columns';
import CategoryColumns from '../../categories/components/display/list/CategoryColumns';
import { CategoryActionsColumn } from '../../categories/components/display/list/CategoryActionsColumn';
import { GroupActionsColumn } from '../components/display/list/GroupActionsColumn';
import ActionBar from '../../../../components/display/actions/ActionBar';
import { useGroupListConfig } from '../config/groupListConfig';
import { mapCategoriesToFilterOptions } from '../utils/groupListUtils';
import type { Group } from '../models';
import type { Category } from '../../categories/models';

const GroupIcon = Icons.Group;

type ViewMode = 'groups' | 'categories';

const GroupsList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('groups');
  const { groups, loading, error } = useGroups();
  const { handleDelete } = useGroupActions();
  const { categories, loading: categoriesLoading } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);
  const reduxCategories = useSelector(selectGroupsCategories);

  const {
    sortKey,
    selectedGroups,
    selectedCategory,
    currentPage,
    pageSize,
    setSelectedCategory,
    setCurrentPage,
    setPageSize,
    setSelectedGroups,
    handleSort,
    sortedGroups,
    paginatedGroups,
    selectedCount,
    hasSelection,
  } = useGroupListState(groups);

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
  } = useCategoryListView({ categories });

  const { handleView, handleEdit, handleDeleteClick, handleViewGroup } = useGroupListActions({
    selectedGroups,
    groups,
    handleDelete,
    setSelectedGroups,
  });

  const categoryFilterOptions = useMemo(
    () => mapCategoriesToFilterOptions(reduxCategories),
    [reduxCategories],
  );

  const { filterSectionConfig, toolbarConfig } = useGroupListConfig({
    categoryFilterOptions,
    selectedCategory,
    onCategoryChange: (value: string) => {
      setSelectedCategory(value);
      setCurrentPage(1);
    },
    viewMode,
    onViewModeChange: setViewMode,
  });

  // Generate columns for groups
  const groupColumns = useMemo(
    () =>
      Columns({
        activeSortKey: sortKey,
        onSort: handleSort,
        categories: reduxCategories,
      }),
    [sortKey, reduxCategories, handleSort],
  );

  // Generate columns for categories
  const categoryColumns = useMemo(
    () =>
      CategoryColumns({
        activeSortKey: categorySortKey,
        onSort: handleCategorySort,
      }),
    [categorySortKey, handleCategorySort],
  );

  // Breadcrumbs based on view mode
  const breadcrumbs = useMemo(() => {
    if (viewMode === 'categories') {
      return [
        { label: GC.LABELS.BREADCRUMBS.GROUPS, onClick: () => setViewMode('groups') },
        { label: 'Categories' },
      ];
    }
    return [{ label: GC.LABELS.BREADCRUMBS.GROUPS }];
  }, [viewMode]);

  // Single page config that changes only columns based on view mode
  const pageConfig: PageLayoutConfig<Group | Category> = useMemo(
    () => ({
      title: GC.LABELS.HEADER_TITLE,
      subtitle: GC.LABELS.HEADER_SUBTITLE,
      breadcrumbs,
      filterSection: filterSectionConfig,
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
                onHeaderCell: () => ({ style: { background: '#fff' } }),
                render: (_: unknown, record: Group | Category) =>
                  viewMode === 'groups' ? <GroupActionsColumn record={record as Group} /> : null,
              },
            ]
          : [
              ...categoryColumns,
              {
                title: '',
                key: 'actions',
                align: 'right' as const,
                width: 120,
                onHeaderCell: () => ({ style: { background: '#fff' } }),
                render: (_: unknown, record: Group | Category) => (
                  <CategoryActionsColumn
                    record={record as Category}
                    onEdit={(cat) => {
                      // TODO: Implement edit category
                      console.log('Edit category:', cat);
                    }}
                    onDelete={(cat) => {
                      // TODO: Implement delete category
                      console.log('Delete category:', cat);
                    }}
                  />
                ),
              },
            ],
      data: (viewMode === 'groups' ? paginatedGroups : paginatedCategories) as (Group | Category)[],
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
              showRowsLabel: 'Show rows',
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
              showRowsLabel: 'Show rows',
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
      rowHeight: GC.SIZES.ROW_HEIGHT,
    }),
    [
      breadcrumbs,
      filterSectionConfig,
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
      selectedCategories,
      hasSelection,
      handleViewGroup,
      setCurrentPage,
      setPageSize,
      setCategoryCurrentPage,
      setCategoryPageSize,
      setSelectedGroups,
      setSelectedCategories,
    ],
  );

  const isFetching = groups === undefined || loading || categoriesLoading;
  const shouldShowEmpty = Array.isArray(groups) && groups.length === 0 && !error;

  // Error state
  if (error) {
    return (
      <div
        style={{
          background: '#fff',
          minHeight: 'calc(100vh - 60px)',
          padding: '48px 32px 32px',
          marginTop: '60px',
        }}
      >
        <div>Error: {error}</div>
      </div>
    );
  }

  // Empty state (only for groups view)
  if (shouldShowEmpty && viewMode === 'groups') {
    return (
      <EmptyState
        title={GC.LABELS.MESSAGES.NO_GROUPS_TITLE}
        description={GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}
        buttonText={GC.LABELS.FORM.BUTTON_TEXT}
        buttonIcon={<GroupIcon size={16} />}
        onButtonClick={() => navigate(APP_ROUTES.GROUP_CREATE)}
        icon={<GroupIcon size={40} />}
      />
    );
  }

  // Loading state
  if (isFetching) {
    return (
        <div
          style={{
          background: '#fff',
          minHeight: 'calc(100vh - 60px)',
          padding: '48px 32px 32px',
          marginTop: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FancySpinner label={SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
        </div>
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Activity mode={viewMode === 'groups' && hasSelection ? 'visible' : 'hidden'}>
        <div
          style={{
            background: '#fff',
            padding: '16px 32px',
            marginTop: '60px',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: '60px',
            zIndex: 10,
          }}
        >
          <ActionBar
            selectedCount={selectedCount}
            hasSelection={hasSelection}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      </Activity>
      <PageLayout config={pageConfig} />
    </div>
  );
};

export default GroupsList;
