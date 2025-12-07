import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { APP_ROUTES, Icons, SHARED_DETAILS_CONSTANTS } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { PageLayout } from '../../../../components/display/views';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import EmptyState from '../../../../components/display/views/EmptyState';
import { FancySpinner } from '../../../../components/animation';
import { useGroups, useGroupActions, useGroupListState, useGroupListActions } from '../hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { selectGroupsCategories } from '../../categories/store/selectors/categorySelectors';
import Columns from '../components/display/list/Columns';
import { GroupActionsColumn } from '../components/display/list/GroupActionsColumn';
import ActionBar from '../../../../components/display/actions/ActionBar';
import { useGroupListConfig } from '../config/groupListConfig';
import { mapCategoriesToFilterOptions } from '../utils/groupListUtils';
import type { Group } from '../models';

const GroupIcon = Icons.Group;

const GroupsList: React.FC = () => {
  const navigate = useNavigate();
  const { groups, loading, error } = useGroups();
  const { handleDelete } = useGroupActions();
  const { loading: categoriesLoading } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);
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
  });

  // Generate columns
  const columns = useMemo(
    () =>
      Columns({
        activeSortKey: sortKey,
        onSort: handleSort,
        categories: reduxCategories,
      }),
    [sortKey, reduxCategories, handleSort],
  );

  const pageConfig: PageLayoutConfig<Group> = useMemo(
    () => ({
      title: GC.LABELS.HEADER_TITLE,
      subtitle: GC.LABELS.HEADER_SUBTITLE,
      filterSection: filterSectionConfig,
      toolbar: toolbarConfig,
      columns: [
        ...columns,
        {
          title: '',
          key: 'actions',
          align: 'right' as const,
          width: 120,
          onHeaderCell: () => ({ style: { background: '#fff' } }),
          render: (_: unknown, record: Group) => <GroupActionsColumn record={record} />,
        },
      ],
      data: paginatedGroups,
      rowKey: (record: Group) => record.id,
      containerStyle: {
        marginTop: hasSelection ? '0' : undefined,
        paddingBottom: '48px',
      },
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
        showRowsLabel: 'Show rows',
      },
      rowSelection: {
        selectedRowKeys: selectedGroups,
        onChange: (keys: React.Key[]) => {
          setSelectedGroups(keys);
        },
      },
      onRowClick: handleViewGroup,
      rowHeight: GC.SIZES.ROW_HEIGHT,
    }),
    [
      filterSectionConfig,
      toolbarConfig,
      columns,
      paginatedGroups,
      currentPage,
      pageSize,
      sortedGroups.length,
      selectedGroups,
      hasSelection,
      handleViewGroup,
      setCurrentPage,
      setPageSize,
      setSelectedGroups,
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

  // Empty state
  if (shouldShowEmpty) {
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
      {hasSelection && (
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
      )}
      <PageLayout config={pageConfig} />
    </div>
  );
};

export default GroupsList;
