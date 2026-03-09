import React, { useState, useMemo, useCallback } from 'react';
import {
  useRoles,
  useRolePanelState,
  useRoleListState,
  useRoleListPageConfig,
  useRoleFilters,
} from '../hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { deduplicateCategoriesByName } from '../../categories/utils/helpers';
import { applyRoleFilters } from '../../groups/utils';
import { CreateRolePanel } from '../panels';
import type { Role, RoleFormValues } from '../models';
import type { FormInstance } from 'antd';
import RolesErrorPage from './RolesErrorPage';
import RolesLoadingPage from './RolesLoadingPage';
import RolesEmptyPage from './RolesEmptyPage';
import RolesListPage from './RolesListPage';

type ViewMode = 'roles' | 'categories';

const MainPage: React.FC = () => {
  const { roles, loading, error } = useRoles();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('roles');
  const [addCategoryPanelOpen, setAddCategoryPanelOpen] = useState(false);

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

  const filteredRoles = useMemo(
    () => applyRoleFilters(roles, appliedFilters, searchTerm),
    [roles, appliedFilters, searchTerm],
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
    handleEditRole,
    onCreateRoleClick: openCreatePanel,
    onFilterClick: openFilterPanel,
    onAddCategoryClick: () => setAddCategoryPanelOpen(true),
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
  });

  const isFetching = useMemo(() => roles.length === 0 && loading, [roles.length, loading]);

  const shouldShowEmpty = useMemo(
    () => Array.isArray(roles) && roles.length === 0 && !loading && !error,
    [roles, loading, error],
  );

  if (error) {
    return <RolesErrorPage error={error} />;
  }

  if (shouldShowEmpty) {
    return (
      <>
        <RolesEmptyPage onCreateRoleClick={openCreatePanel} />
        {createPanelOpen && (
          <CreateRolePanel
            open={createPanelOpen}
            onClose={closeCreatePanel}
            form={createForm as FormInstance<RoleFormValues>}
          />
        )}
      </>
    );
  }

  if (isFetching) {
    return <RolesLoadingPage />;
  }

  return (
    <RolesListPage
      pageConfig={pageConfig}
      createPanelOpen={createPanelOpen}
      editPanelOpen={editPanelOpen}
      viewPanelOpen={viewPanelOpen}
      viewingRole={viewingRole}
      editingRole={editingRole}
      createForm={createForm}
      editForm={editForm}
      filterPanelOpen={filterPanelOpen}
      addCategoryPanelOpen={addCategoryPanelOpen}
      onCloseCreatePanel={closeCreatePanel}
      onCloseEditPanel={closeEditPanel}
      onCloseViewPanel={closeViewPanel}
      onCloseFilterPanel={closeFilterPanel}
      onCloseAddCategoryPanel={() => setAddCategoryPanelOpen(false)}
      handleFilterChange={handleFilterChange}
      handleFilterApply={handleFilterApply}
      handleFilterReset={handleFilterReset}
      onViewPanelEdit={handleViewPanelEdit}
    />
  );
};

export default MainPage;
