import React, { useState, useMemo, useCallback } from 'react';
import { getCurrentUser } from '../../../auth/utils';
import { usePermission, ACTION_PERMISSIONS } from '../../../auth/hooks';
import { useUsers, useUserFilters, useBulkDeleteUsers, useUserListState } from '../hooks';
import { useUserListPageConfig } from '../hooks/list/useUserListPageConfig';
import { useUserPanelState } from '../hooks/panels/user/useUserPanelState';
import { applyUserFilters } from '../utils/filter/applyUserFilters';
import { CreateUserPanel } from '../panels';
import type { User } from '../models';
import UsersErrorPage from './UsersErrorPage';
import UsersLoadingPage from './UsersLoadingPage';
import UsersEmptyPage from './UsersEmptyPage';
import UsersListPage from './UsersListPage';

const MainPage: React.FC = () => {
  const { users, loading, error } = useUsers();
  const canCreateUser = usePermission(
    ACTION_PERMISSIONS.users.create.scope,
    ACTION_PERMISSIONS.users.create.level,
    ACTION_PERMISSIONS.users.create.deny,
  );
  const canEditUser = usePermission(
    ACTION_PERMISSIONS.users.edit.scope,
    ACTION_PERMISSIONS.users.edit.level,
    ACTION_PERMISSIONS.users.edit.deny,
  );
  const canDeleteUser = usePermission(
    ACTION_PERMISSIONS.users.delete.scope,
    ACTION_PERMISSIONS.users.delete.level,
    ACTION_PERMISSIONS.users.delete.deny,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  const {
    filterPanelOpen,
    closeFilterPanel,
    appliedFilters,
    handleFilterChange,
    handleFilterApply,
    handleFilterReset,
    openFilterPanel,
  } = useUserFilters();

  const {
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    manageRolePanelOpen,
    manageGroupPanelOpen,
    viewingUser,
    editingUser,
    managingRoleUser,
    managingGroupUser,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
    openViewPanel,
    closeViewPanel,
    openManageRolePanel,
    closeManageRolePanel,
    openManageGroupPanel,
    closeManageGroupPanel,
  } = useUserPanelState();

  const usersExcludingSelf = useMemo(() => {
    const currentUser = getCurrentUser();
    if (!currentUser?.id) return users;
    return users.filter((u) => u.id !== currentUser.id);
  }, [users]);

  const filteredUsers = useMemo(
    () => applyUserFilters(usersExcludingSelf, appliedFilters, searchTerm),
    [usersExcludingSelf, appliedFilters, searchTerm],
  );

  const {
    sortKey,
    selectedUsers,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    setSelectedUsers,
    handleSort,
    sortedUsers,
    paginatedUsers,
  } = useUserListState(filteredUsers);

  const { isDeleting, handleBulkDelete } = useBulkDeleteUsers({
    selectedUsers,
    setSelectedUsers,
  });

  const handleViewUser = useCallback((user: User) => openViewPanel(user), [openViewPanel]);
  const handleEditUser = useCallback((user: User) => openEditPanel(user), [openEditPanel]);

  const handleViewPanelEdit = useCallback(() => {
    if (viewingUser) {
      closeViewPanel();
      setTimeout(() => openEditPanel(viewingUser), 150);
    }
  }, [viewingUser, closeViewPanel, openEditPanel]);

  const handleManageRolesClick = useCallback(() => {
    if (selectedUsers.length === 1) {
      const selectedId = selectedUsers[0] as string;
      const selectedUser = filteredUsers.find((u) => u.id === selectedId);
      if (selectedUser) openManageRolePanel(selectedUser);
    }
  }, [selectedUsers, filteredUsers, openManageRolePanel]);

  const handleManageGroupsClick = useCallback(() => {
    if (selectedUsers.length === 1) {
      const selectedId = selectedUsers[0] as string;
      const selectedUser = filteredUsers.find((u) => u.id === selectedId);
      if (selectedUser) openManageGroupPanel(selectedUser);
    }
  }, [selectedUsers, filteredUsers, openManageGroupPanel]);

  const handleBulkDeleteClick = useCallback(() => {
    if (selectedUsers.length >= 2) setBulkDeleteModalOpen(true);
  }, [selectedUsers.length]);

  const handleConfirmBulkDelete = useCallback(async () => {
    await handleBulkDelete();
    setBulkDeleteModalOpen(false);
  }, [handleBulkDelete]);

  const handleCloseBulkDeleteModal = useCallback(() => {
    setBulkDeleteModalOpen(false);
  }, []);

  const pageConfig = useUserListPageConfig({
    sortKey,
    handleSort,
    selectedUsers,
    setSelectedUsers,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    sortedUsers,
    paginatedUsers,
    hasSelection: selectedUsers.length > 0,
    handleViewUser,
    handleEditUser: canEditUser ? handleEditUser : () => undefined,
    onCreateUserClick: openCreatePanel,
    canCreateUser,
    onFilterClick: openFilterPanel,
    onBulkDeleteClick: handleBulkDeleteClick,
    onManageRoleClick: handleManageRolesClick,
    onManageGroupClick: handleManageGroupsClick,
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
    onSearchSubmit: undefined,
  });

  // Fix: guard empty state render until data is confirmed loaded
  const isFetching = useMemo(() => loading, [loading]);

  const shouldShowEmpty = useMemo(
    () => Array.isArray(users) && usersExcludingSelf.length === 0 && !loading && !error,
    [users, usersExcludingSelf.length, loading, error],
  );

  if (error) {
    return <UsersErrorPage error={error} />;
  }

  if (shouldShowEmpty) {
    return (
      <>
        <UsersEmptyPage onCreateUserClick={canCreateUser ? openCreatePanel : undefined} />
        {createPanelOpen && (
          <CreateUserPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
        )}
      </>
    );
  }

  if (isFetching) {
    return <UsersLoadingPage />;
  }

  return (
    <UsersListPage
      pageConfig={pageConfig}
      createPanelOpen={createPanelOpen}
      editPanelOpen={editPanelOpen}
      viewPanelOpen={viewPanelOpen}
      manageRolePanelOpen={manageRolePanelOpen}
      manageGroupPanelOpen={manageGroupPanelOpen}
      viewingUser={viewingUser}
      editingUser={editingUser}
      managingRoleUser={managingRoleUser}
      managingGroupUser={managingGroupUser}
      createForm={createForm}
      editForm={editForm}
      filterPanelOpen={filterPanelOpen}
      onCloseFilterPanel={closeFilterPanel}
      handleFilterChange={handleFilterChange}
      handleFilterApply={handleFilterApply}
      handleFilterReset={handleFilterReset}
      bulkDeleteModalOpen={bulkDeleteModalOpen}
      bulkDeleteSelectedCount={selectedUsers.length}
      bulkDeleteIsDeleting={isDeleting}
      onCloseBulkDeleteModal={handleCloseBulkDeleteModal}
      onConfirmBulkDelete={handleConfirmBulkDelete}
      onCloseCreatePanel={closeCreatePanel}
      onCloseEditPanel={closeEditPanel}
      onCloseViewPanel={closeViewPanel}
      onCloseManageRolePanel={closeManageRolePanel}
      onCloseManageGroupPanel={closeManageGroupPanel}
      onViewPanelEdit={canEditUser ? handleViewPanelEdit : undefined}
      canDeleteUser={canDeleteUser}
    />
  );
};

export default MainPage;
