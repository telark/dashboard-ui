import React, { useState } from 'react';
import { Activity } from 'react';
import { SHARED_DETAILS_CONSTANTS } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { PageLayout } from '../../../../components/display/views';
import EmptyState from '../../../../components/display/views/EmptyState';
import { FancySpinner } from '../../../../components/animation';
import ActionBar from '../../../../components/display/actions/ActionBar';
import { Icons } from '../../../../constants';
import {
  useGroups,
  useGroupActions,
  useGroupListState,
  useGroupListActions,
  useGroupPanels,
  useGroupListPageConfig,
} from '../hooks';
import { useCategories, useCategoryListView } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { CreateGroupPanel, EditGroupPanel } from '../panels';

const GroupIcon = Icons.Group;

type ViewMode = 'groups' | 'categories';

const MainPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('groups');
  const { groups, loading, error } = useGroups();
  const { handleDelete } = useGroupActions();
  const { categories, loading: categoriesLoading } = useCategories(
    CATEGORIES_CONSTANTS.SCOPES.GROUPS,
  );

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

  const {
    createPanelOpen,
    editPanelOpen,
    editingGroup,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
  } = useGroupPanels();

  const { handleView, handleEdit, handleDeleteClick, handleViewGroup } = useGroupListActions({
    selectedGroups,
    groups,
    handleDelete,
    setSelectedGroups,
    onEdit: openEditPanel,
  });

  const pageConfig = useGroupListPageConfig({
    viewMode,
    setViewMode,
    categories,
    sortKey,
    handleSort,
    selectedGroups,
    setSelectedGroups,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    sortedGroups,
    paginatedGroups,
    hasSelection,
    handleViewGroup,
    handleEditClick: openEditPanel,
    onCreateGroupClick: openCreatePanel,
  });

  const isFetching = groups === undefined || loading || categoriesLoading;
  const shouldShowEmpty = Array.isArray(groups) && groups.length === 0 && !error;

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

  if (shouldShowEmpty && viewMode === 'groups') {
    return (
      <EmptyState
        title={GC.LABELS.MESSAGES.NO_GROUPS_TITLE}
        description={GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}
        buttonText={GC.LABELS.FORM.BUTTON_TEXT}
        buttonIcon={<GroupIcon size={16} />}
        onButtonClick={openCreatePanel}
        icon={<GroupIcon size={40} />}
      />
    );
  }

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
      <CreateGroupPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
      <EditGroupPanel
        open={editPanelOpen}
        onClose={closeEditPanel}
        editingGroup={editingGroup}
        form={editForm}
      />
    </div>
  );
};

export default MainPage;
