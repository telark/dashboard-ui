import React, { useState, useMemo } from 'react';
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
  useGroupFilters,
} from '../hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import {
  CreateGroupPanel,
  EditGroupPanel,
  ViewGroupPanel,
  AttachRolePanel,
  AttachMemberPanel,
} from '../panels';
import ActionConfirmModal from '../../../../components/display/modal/confirm/ActionConfirmModal';
import { FilterPanel } from '../../../../components/display/panels/filter';
import { buildGroupFilterFields } from '../config/groupFilterConfig';
import { applyGroupFilters, mapCategoriesToFilterOptions } from '../utils';

const GroupIcon = Icons.Group;

type ViewMode = 'groups' | 'categories';

const MainPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('groups');
  const { groups, loading, error } = useFetchGroups();
  const { categories, loading: categoriesLoading } = useCategories(
    CATEGORIES_CONSTANTS.SCOPES.GROUPS,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const categoryOptions = useMemo(
    () => mapCategoriesToFilterOptions(categories || []),
    [categories],
  );

  const {
    filterPanelOpen,
    openFilterPanel,
    closeFilterPanel,
    appliedFilters,
    handleFilterChange,
    handleFilterApply,
    handleFilterReset,
  } = useGroupFilters();

  const filteredGroups = useMemo(
    () => applyGroupFilters(groups, appliedFilters, searchTerm),
    [groups, appliedFilters, searchTerm],
  );

  const {
    sortKey,
    selectedGroups,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    setSelectedGroups,
    handleSort,
    sortedGroups,
    paginatedGroups,
    selectedCount,
    hasSelection,
  } = useGroupListState(filteredGroups);

  const {
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    attachRolePanelOpen,
    attachMemberPanelOpen,
    viewingGroup,
    editingGroup,
    attachingRoleGroup,
    attachingMemberGroup,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
    openViewPanel,
    closeViewPanel,
    openAttachRolePanel,
    closeAttachRolePanel,
    openAttachMemberPanel,
    closeAttachMemberPanel,
  } = useGroupPanelState();

  const { handleViewGroup } = useGroupListInteractions({
    selectedGroups,
    groups: filteredGroups,
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

  const handleAttachRoleClick = () => {
    if (selectedCount === 1 && filteredGroups) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = filteredGroups.find((g) => g.id === selectedId);
      if (selectedGroup) {
        openAttachRolePanel(selectedGroup);
      }
    }
  };

  const handleAttachMemberClick = () => {
    if (selectedCount === 1 && filteredGroups) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = filteredGroups.find((g) => g.id === selectedId);
      if (selectedGroup) {
        openAttachMemberPanel(selectedGroup);
      }
    }
  };

  const pageConfig = useGroupListPageConfig({
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
    handleEditClick: openEditPanel,
    onCreateGroupClick: openCreatePanel,
    selectedGroupsCount: selectedCount,
    onBulkDeleteClick: handleBulkDeleteClick,
    onAttachRoleClick: handleAttachRoleClick,
    onAttachMemberClick: handleAttachMemberClick,
    onFilterClick: openFilterPanel,
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
    onSearchSubmit: undefined,
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
      {attachRolePanelOpen && attachingRoleGroup && (
        <AttachRolePanel
          open={attachRolePanelOpen}
          onClose={closeAttachRolePanel}
          group={attachingRoleGroup}
        />
      )}
      {attachMemberPanelOpen && attachingMemberGroup && (
        <AttachMemberPanel
          open={attachMemberPanelOpen}
          onClose={closeAttachMemberPanel}
          group={attachingMemberGroup}
        />
      )}
      <FilterPanel
        open={filterPanelOpen}
        onClose={closeFilterPanel}
        fields={buildGroupFilterFields(categoryOptions)}
        onFilterChange={handleFilterChange}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />
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
