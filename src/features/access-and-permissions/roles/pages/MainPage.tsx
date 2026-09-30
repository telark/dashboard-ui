import React, { useState, useMemo, useCallback } from 'react';
import {
  useRoles,
  useRolePanelState,
  useRoleListState,
  useRoleListPageConfig,
  useRoleFilters,
  useBulkDeleteRoles,
} from '../hooks';
import { usePermission, ACTION_PERMISSIONS } from '../../../auth/hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { deduplicateCategoriesByName } from '../../categories/utils/helpers';
import { applyRoleFilters } from '../../groups/utils';
import { CreateRolePanel } from '../panels';
import { ROLES_CONSTANTS as RPC } from '../constants';
import type { Role, RoleFormValues } from '../models';
import type { Category } from '../../categories/models';
import type { FormInstance } from 'antd';
import RolesEmptyPage from './RolesEmptyPage';
import RolesListPage from './RolesListPage';

type ViewMode = 'roles' | 'categories';

const MainPage: React.FC = () => {
  const { roles, loading, error, refetch } = useRoles();
  const canCreateRole = usePermission(
    ACTION_PERMISSIONS.roles.create.scope,
    ACTION_PERMISSIONS.roles.create.level,
    ACTION_PERMISSIONS.roles.create.deny,
  );
  const canEditRole = usePermission(
    ACTION_PERMISSIONS.roles.edit.scope,
    ACTION_PERMISSIONS.roles.edit.level,
    ACTION_PERMISSIONS.roles.edit.deny,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('roles');
  const [addCategoryPanelOpen, setAddCategoryPanelOpen] = useState(false);
  const [editCategoryPanelOpen, setEditCategoryPanelOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);
  const uniqueCategories = useMemo(
    () => deduplicateCategoriesByName(categories ?? []),
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
    handleRemoveFilterChip,
    filterChips,
    overflowChipsCount,
    hasActiveFilters,
  } = useRoleFilters(uniqueCategories);

  const {
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    viewingRole,
    editingRole,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
    openViewPanel,
    closeViewPanel,
  } = useRolePanelState();

  const customRoles = useMemo(() => roles.filter((r) => r.type !== RPC.TYPE.BUILT_IN), [roles]);

  const filteredRoles = useMemo(
    () => applyRoleFilters(customRoles, appliedFilters, searchTerm),
    [customRoles, appliedFilters, searchTerm],
  );

  const {
    sortKey,
    sortOrder,
    selectedRoles,
    setSelectedRoles,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleSort,
    sortedRoles,
    paginatedRoles,
    bulkMode,
    toggleBulkMode,
  } = useRoleListState(filteredRoles);

  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const { isDeleting, handleBulkDelete } = useBulkDeleteRoles({ selectedRoles, setSelectedRoles });
  const handleConfirmBulkDelete = useCallback(async () => {
    await handleBulkDelete();
    setBulkDeleteModalOpen(false);
  }, [handleBulkDelete]);

  const handleViewRole = useCallback((role: Role) => openViewPanel(role), [openViewPanel]);
  const handleEditRole = useCallback((role: Role) => openEditPanel(role), [openEditPanel]);

  const handleViewPanelEdit = useCallback(() => {
    if (viewingRole) {
      closeViewPanel();
      setTimeout(() => openEditPanel(viewingRole), 150);
    }
  }, [viewingRole, closeViewPanel, openEditPanel]);

  const openEditCategoryPanel = useCallback((category: Category) => {
    setEditingCategory(category);
    setEditCategoryPanelOpen(true);
  }, []);
  const closeEditCategoryPanel = useCallback(() => {
    setEditCategoryPanelOpen(false);
    setEditingCategory(null);
  }, []);

  const pageConfig = useRoleListPageConfig({
    viewMode,
    setViewMode,
    categories: uniqueCategories,
    sortKey,
    handleSort,
    sortOrder: sortOrder ?? 'desc',
    selectedRoles,
    setSelectedRoles,
    bulkMode,
    onToggleBulkMode: toggleBulkMode,
    onBulkDeleteClick: () => setBulkDeleteModalOpen(true),
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    sortedRoles,
    paginatedRoles,
    handleViewRole,
    handleEditRole: canEditRole ? handleEditRole : () => undefined,
    onEditCategory: openEditCategoryPanel,
    onCreateRoleClick: openCreatePanel,
    canCreateRole,
    onFilterClick: openFilterPanel,
    onAddCategoryClick: () => setAddCategoryPanelOpen(true),
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
    filterChips,
    overflowChipsCount,
    onRemoveFilterChip: handleRemoveFilterChip,
    hasActiveFilters,
    onClearAllFilters: handleFilterReset,
  });

  const shouldShowEmpty = useMemo(
    () => Array.isArray(roles) && customRoles.length === 0 && !error && !loading,
    [roles, customRoles.length, error, loading],
  );

  const augmentedPageConfig = { ...pageConfig, loading, error, onRetry: refetch };

  const createPanelNode = createPanelOpen ? (
    <CreateRolePanel
      open={createPanelOpen}
      onClose={closeCreatePanel}
      form={createForm as FormInstance<RoleFormValues>}
    />
  ) : null;

  if (shouldShowEmpty) {
    return (
      <>
        <RolesEmptyPage onCreateRoleClick={canCreateRole ? openCreatePanel : undefined} />
        {createPanelNode}
      </>
    );
  }

  return (
    <RolesListPage
      pageConfig={augmentedPageConfig}
      createPanelOpen={createPanelOpen}
      editPanelOpen={editPanelOpen}
      viewPanelOpen={viewPanelOpen}
      viewingRole={viewingRole}
      editingRole={editingRole}
      createForm={createForm}
      editForm={editForm}
      filterPanelOpen={filterPanelOpen}
      addCategoryPanelOpen={addCategoryPanelOpen}
      editCategoryPanelOpen={editCategoryPanelOpen}
      editingCategory={editingCategory}
      onCloseCreatePanel={closeCreatePanel}
      onCloseEditPanel={closeEditPanel}
      onCloseViewPanel={closeViewPanel}
      appliedFilters={appliedFilters}
      onCloseFilterPanel={closeFilterPanel}
      onCloseAddCategoryPanel={() => setAddCategoryPanelOpen(false)}
      onCloseEditCategoryPanel={closeEditCategoryPanel}
      handleFilterChange={handleFilterChange}
      handleFilterApply={handleFilterApply}
      handleFilterReset={handleFilterReset}
      onViewPanelEdit={canEditRole ? handleViewPanelEdit : undefined}
      bulkDeleteModalOpen={bulkDeleteModalOpen}
      bulkDeleteSelectedCount={selectedRoles.length}
      bulkDeleteIsDeleting={isDeleting}
      onCloseBulkDeleteModal={() => setBulkDeleteModalOpen(false)}
      onConfirmBulkDelete={handleConfirmBulkDelete}
    />
  );
};

export default MainPage;
