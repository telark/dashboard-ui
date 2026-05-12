import React, { useState, useMemo, useCallback } from 'react';
import {
  useRoles,
  useRolePanelState,
  useRoleListState,
  useRoleListPageConfig,
  useRoleFilters,
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
  } = useRoleFilters();

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
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    setSelectedRoles,
    handleSort,
    sortedRoles,
    paginatedRoles,
  } = useRoleListState(filteredRoles);

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
  });

  const hasFetchedRoles = Array.isArray(roles) && roles.length > 0;
  const shouldShowEmpty = useMemo(
    () =>
      Array.isArray(roles) &&
      customRoles.length === 0 &&
      !error &&
      (hasFetchedRoles || !loading),
    [roles, customRoles.length, error, hasFetchedRoles, loading],
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
      onCloseFilterPanel={closeFilterPanel}
      onCloseAddCategoryPanel={() => setAddCategoryPanelOpen(false)}
      onCloseEditCategoryPanel={closeEditCategoryPanel}
      handleFilterChange={handleFilterChange}
      handleFilterApply={handleFilterApply}
      handleFilterReset={handleFilterReset}
      onViewPanelEdit={canEditRole ? handleViewPanelEdit : undefined}
    />
  );
};

export default MainPage;
