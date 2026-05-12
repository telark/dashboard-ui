import React, { useState, useMemo, useCallback } from 'react';
import {
  useFetchGroups,
  useGroupListState,
  useGroupListInteractions,
  useGroupPanelState,
  useGroupListPageConfig,
  useBulkDeleteGroups,
  useGroupFilters,
} from '../hooks';
import { usePermission, ACTION_PERMISSIONS } from '../../../auth/hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { applyGroupFilters, mapCategoriesToFilterOptions } from '../utils';
import type { Group } from '../models';
import type { Category } from '../../categories/models';
import GroupsEmptyPage from './GroupsEmptyPage';
import GroupsListPage from './GroupsListPage';

type ViewMode = 'groups' | 'categories';

const MainPage: React.FC = () => {
  const canCreateGroup = usePermission(
    ACTION_PERMISSIONS.groups.create.scope,
    ACTION_PERMISSIONS.groups.create.level,
    ACTION_PERMISSIONS.groups.create.deny,
  );
  const canEditGroup = usePermission(
    ACTION_PERMISSIONS.groups.edit.scope,
    ACTION_PERMISSIONS.groups.edit.level,
    ACTION_PERMISSIONS.groups.edit.deny,
  );
  const canDeleteGroup = usePermission(
    ACTION_PERMISSIONS.groups.delete.scope,
    ACTION_PERMISSIONS.groups.delete.level,
    ACTION_PERMISSIONS.groups.delete.deny,
  );
  const [viewMode, setViewMode] = useState<ViewMode>('groups');
  const [addCategoryPanelOpen, setAddCategoryPanelOpen] = useState(false);
  const [editCategoryPanelOpen, setEditCategoryPanelOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { groups, loading, error, refetch } = useFetchGroups();
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

  const handleBulkDeleteClick = useCallback(() => {
    if (selectedCount >= 2) {
      setBulkDeleteModalOpen(true);
    }
  }, [selectedCount]);

  const handleConfirmBulkDelete = useCallback(async () => {
    await handleBulkDelete();
    setBulkDeleteModalOpen(false);
  }, [handleBulkDelete]);

  const handleAttachRoleClick = useCallback(() => {
    if (selectedCount === 1 && filteredGroups) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = filteredGroups.find((g) => g.id === selectedId);
      if (selectedGroup) {
        openAttachRolePanel(selectedGroup);
      }
    }
  }, [selectedCount, filteredGroups, selectedGroups, openAttachRolePanel]);

  const handleAttachMemberClick = useCallback(() => {
    if (selectedCount === 1 && filteredGroups) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = filteredGroups.find((g) => g.id === selectedId);
      if (selectedGroup) {
        openAttachMemberPanel(selectedGroup);
      }
    }
  }, [selectedCount, filteredGroups, selectedGroups, openAttachMemberPanel]);

  const handleCloseBulkDeleteModal = useCallback(() => {
    setBulkDeleteModalOpen(false);
  }, []);

  const handleViewPanelEdit = useCallback(
    (group: Group) => {
      closeViewPanel();
      setTimeout(() => {
        openEditPanel(group);
      }, 150);
    },
    [closeViewPanel, openEditPanel],
  );

  const onAddCategoryClick = useCallback(() => setAddCategoryPanelOpen(true), []);
  const closeAddCategoryPanel = useCallback(() => setAddCategoryPanelOpen(false), []);
  const openEditCategoryPanel = useCallback((category: Category) => {
    setEditingCategory(category);
    setEditCategoryPanelOpen(true);
  }, []);
  const closeEditCategoryPanel = useCallback(() => {
    setEditCategoryPanelOpen(false);
    setEditingCategory(null);
  }, []);

  const shouldShowEmpty = useMemo(
    () => Array.isArray(groups) && groups.length === 0 && !error,
    [groups, error],
  );

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
    handleEditClick: canEditGroup ? openEditPanel : () => undefined,
    onCreateGroupClick: openCreatePanel,
    canCreateGroup,
    onAddCategoryClick,
    onEditCategory: openEditCategoryPanel,
    selectedGroupsCount: selectedCount,
    onBulkDeleteClick: handleBulkDeleteClick,
    onAttachRoleClick: handleAttachRoleClick,
    onAttachMemberClick: handleAttachMemberClick,
    onFilterClick: openFilterPanel,
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
    onSearchSubmit: undefined,
  });

  if (shouldShowEmpty && viewMode === 'groups') {
    return (
      <GroupsEmptyPage
        createPanelOpen={createPanelOpen}
        onCloseCreatePanel={closeCreatePanel}
        onCreateGroupClick={canCreateGroup ? openCreatePanel : undefined}
        createForm={createForm}
      />
    );
  }

  const augmentedPageConfig = {
    ...pageConfig,
    loading: loading || categoriesLoading,
    error,
    onRetry: refetch,
  };

  return (
    <GroupsListPage
      pageConfig={augmentedPageConfig}
      createPanelOpen={createPanelOpen}
      editPanelOpen={editPanelOpen}
      viewPanelOpen={viewPanelOpen}
      attachRolePanelOpen={attachRolePanelOpen}
      attachMemberPanelOpen={attachMemberPanelOpen}
      viewingGroup={viewingGroup}
      editingGroup={editingGroup}
      attachingRoleGroup={attachingRoleGroup}
      attachingMemberGroup={attachingMemberGroup}
      createForm={createForm}
      editForm={editForm}
      filterPanelOpen={filterPanelOpen}
      categoryOptions={categoryOptions}
      bulkDeleteModalOpen={bulkDeleteModalOpen}
      selectedCount={selectedCount}
      isDeleting={isDeleting}
      addCategoryPanelOpen={addCategoryPanelOpen}
      editCategoryPanelOpen={editCategoryPanelOpen}
      editingCategory={editingCategory}
      onCloseCreatePanel={closeCreatePanel}
      onCloseEditPanel={closeEditPanel}
      onCloseViewPanel={closeViewPanel}
      onCloseAttachRolePanel={closeAttachRolePanel}
      onCloseAttachMemberPanel={closeAttachMemberPanel}
      onCloseFilterPanel={closeFilterPanel}
      onCloseAddCategoryPanel={closeAddCategoryPanel}
      onCloseEditCategoryPanel={closeEditCategoryPanel}
      onCloseBulkDeleteModal={handleCloseBulkDeleteModal}
      onConfirmBulkDelete={handleConfirmBulkDelete}
      onViewPanelEdit={canEditGroup ? handleViewPanelEdit : undefined}
      canDeleteGroup={canDeleteGroup}
      handleFilterChange={handleFilterChange}
      handleFilterApply={handleFilterApply}
      handleFilterReset={handleFilterReset}
    />
  );
};

export default MainPage;
