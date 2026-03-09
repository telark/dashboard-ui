import React, { useState, useMemo, useCallback } from 'react';
import {
  useRoles,
  useRolePanelState,
  useRoleListState,
  useRoleListPageConfig,
} from '../hooks';
import { CreateRolePanel } from '../panels';
import type { Role, RoleFormValues } from '../models';
import type { FormInstance } from 'antd';
import RolesErrorPage from './RolesErrorPage';
import RolesLoadingPage from './RolesLoadingPage';
import RolesEmptyPage from './RolesEmptyPage';
import RolesListPage from './RolesListPage';

const MainPage: React.FC = () => {
  const { roles, loading, error } = useRoles();
  const [searchTerm, setSearchTerm] = useState('');

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
    () =>
      roles.filter((r) =>
        r.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()),
      ),
    [roles, searchTerm],
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
      onCloseCreatePanel={closeCreatePanel}
      onCloseEditPanel={closeEditPanel}
      onCloseViewPanel={closeViewPanel}
      onViewPanelEdit={handleViewPanelEdit}
    />
  );
};

export default MainPage;
