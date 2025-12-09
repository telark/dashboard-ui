import React, { useState } from 'react';
import { SHARED_DETAILS_CONSTANTS } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { PageLayout } from '../../../../components/display/views';
import EmptyState from '../../../../components/display/views/EmptyState';
import { FancySpinner } from '../../../../components/animation';
import { Icons } from '../../../../constants';
import {
  useFetchGroups,
  useGroupListState,
  useGroupListInteractions,
  useGroupPanelState,
  useGroupListPageConfig,
  useBulkDeleteGroups,
} from '../hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { CreateGroupPanel, EditGroupPanel, ViewGroupPanel } from '../panels';
import ActionConfirmModal from '../../../../components/display/modal/confirm/ActionConfirmModal';

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

  const { handleViewGroup } = useGroupListInteractions({
    selectedGroups,
    groups,
    handleDelete: async () => {},
    setSelectedGroups,
    onEdit: openEditPanel,
    onView: openViewPanel,
  });

  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const { isDeleting, handleBulkDelete } = useBulkDeleteGroups({
    selectedGroups,
    groups,
    setSelectedGroups,
  });

  const handleBulkDeleteClick = () => {
    if (selectedCount >= 2) {
      setBulkDeleteModalOpen(true);
    }
  };

  const handleConfirmBulkDelete = async () => {
    await handleBulkDelete();
    setBulkDeleteModalOpen(false);
  };

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
    selectedGroupsCount: selectedCount,
    onBulkDeleteClick: handleBulkDeleteClick,
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
          icon={<GroupIcon size={32} />}
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
      {bulkDeleteModalOpen && (
        <ActionConfirmModal
          open={bulkDeleteModalOpen}
          onClose={() => setBulkDeleteModalOpen(false)}
          onConfirm={handleConfirmBulkDelete}
          title={GC.LABELS.ACTIONS.BULK_DELETE_MODAL_TITLE}
          action="delete"
          resourceName={`${selectedCount} group${selectedCount > 1 ? 's' : ''}`}
          confirmText={GC.LABELS.ACTIONS.DELETE_MODAL_OK}
          cancelText="Cancel"
          loading={isDeleting}
          danger={true}
        />
      )}
    </div>
  );
};

export default MainPage;
