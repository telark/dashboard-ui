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
  useFetchGroups,
  useGroupListState,
  useGroupListInteractions,
  useGroupPanelState,
  useGroupListPageConfig,
} from '../hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { CreateGroupPanel, EditGroupPanel, ViewGroupPanel } from '../panels';

const GroupIcon = Icons.Group;

type ViewMode = 'groups' | 'categories';

const MainPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('groups');
  const { groups, loading, error } = useFetchGroups();
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
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    viewingGroup,
    editingGroup,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
    openViewPanel,
    closeViewPanel,
  } = useGroupPanelState();

  const { handleView, handleEdit, handleViewGroup } = useGroupListInteractions({
    selectedGroups,
    groups,
    handleDelete: async () => {},
    setSelectedGroups,
    onEdit: openEditPanel,
    onView: openViewPanel,
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
      <>
        <EmptyState
          title={GC.LABELS.MESSAGES.NO_GROUPS_TITLE}
          description={GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}
          buttonText={GC.LABELS.FORM.BUTTON_TEXT}
          buttonIcon={<GroupIcon size={16} />}
          onButtonClick={openCreatePanel}
          icon={<GroupIcon size={40} />}
        />
        {createPanelOpen && (
          <CreateGroupPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
        )}
      </>
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
          />
        </div>
      </Activity>
      <PageLayout config={pageConfig} />
      {createPanelOpen && (
        <CreateGroupPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
      )}
      {editPanelOpen && editingGroup && (
        <EditGroupPanel
          open={editPanelOpen}
          onClose={closeEditPanel}
          editingGroup={editingGroup}
          form={editForm}
        />
      )}
      {viewPanelOpen && viewingGroup && (
        <ViewGroupPanel
          open={viewPanelOpen}
          onClose={closeViewPanel}
          group={viewingGroup}
          onEdit={() => {
            closeViewPanel();
            setTimeout(() => {
              openEditPanel(viewingGroup);
            }, 150);
          }}
        />
      )}
    </div>
  );
};

export default MainPage;
