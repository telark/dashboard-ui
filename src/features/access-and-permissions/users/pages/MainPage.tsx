import React, { useState, useMemo, useCallback } from 'react';
import { getCurrentUser } from '../../../auth/utils';
import { usePermission, ACTION_PERMISSIONS } from '../../../auth/hooks';
import { useUsers, useUserFilters, useBulkDeleteUsers, useUserListState } from '../hooks';
import { useUserListPageConfig } from '../hooks/list/useUserListPageConfig';
import { useUserPanelState } from '../hooks/panels/user/useUserPanelState';
import { applyUserFilters } from '../utils/filter/applyUserFilters';
import { CreateUserPanel } from '../panels';
import type { User } from '../models';
import UsersEmptyPage from './UsersEmptyPage';
import UsersListPage from './UsersListPage';

const MainPage: React.FC = () => {
  const { users, loaded, error, refetch } = useUsers();
  const canCreateUser = usePermission(
    ACTION_PERMISSIONS.users.create.scope,
    ACTION_PERMISSIONS.users.create.level,
    ACTION_PERMISSIONS.users.create.deny,
  );
  const canSuspendUser = usePermission(
    ACTION_PERMISSIONS.users.suspend.scope,
    ACTION_PERMISSIONS.users.suspend.level,
    ACTION_PERMISSIONS.users.suspend.deny,
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
    handleRemoveFilterChip,
    filterChips,
    overflowChipsCount,
    hasActiveFilters,
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
    bulkMode,
    toggleBulkMode,
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
    handleEditUser: canSuspendUser ? handleEditUser : () => undefined,
    onCreateUserClick: openCreatePanel,
    canCreateUser,
    onFilterClick: openFilterPanel,
    onBulkDeleteClick: handleBulkDeleteClick,
    onManageRoleClick: handleManageRolesClick,
    onManageGroupClick: handleManageGroupsClick,
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
    onSearchSubmit: undefined,
    bulkMode,
    onToggleBulkMode: toggleBulkMode,
    filterChips,
    overflowChipsCount,
    onRemoveFilterChip: handleRemoveFilterChip,
    hasActiveFilters,
    onClearAllFilters: handleFilterReset,
  });

  const shouldShowEmpty = useMemo(
    () => Array.isArray(users) && usersExcludingSelf.length === 0 && !error && loaded,
    [users, usersExcludingSelf.length, error, loaded],
  );

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

  const augmentedPageConfig = {
    ...pageConfig,
    loading: !loaded,
    fullPageLoading: !loaded,
    error,
    onRetry: refetch,
  };

  return (
    <UsersListPage
      pageConfig={augmentedPageConfig}
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
      appliedFilters={appliedFilters}
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
      onViewPanelEdit={canSuspendUser ? handleViewPanelEdit : undefined}
      canDeleteUser={canDeleteUser}
    />
  );
};

export default MainPage;
