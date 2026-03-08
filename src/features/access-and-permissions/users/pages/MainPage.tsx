import React, { useState, useMemo, useCallback } from 'react';
import { getCurrentUser } from '../../../auth/utils';
import { useUsers } from '../hooks';
import { useUserListState } from '../hooks/list/useUserListState';
import { useUserListPageConfig } from '../hooks/list/useUserListPageConfig';
import { useUserPanelState } from '../hooks/panels/user/useUserPanelState';
import { applySearch } from '../../../../utils/search';
import { CreateUserPanel } from '../panels';
import type { User } from '../models';
import UsersErrorPage from './UsersErrorPage';
import UsersLoadingPage from './UsersLoadingPage';
import UsersEmptyPage from './UsersEmptyPage';
import UsersListPage from './UsersListPage';

const MainPage: React.FC = () => {
  const { users, loading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');

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
    () =>
      applySearch(usersExcludingSelf, searchTerm, [
        (u: User) => u.username,
        (u: User) => u.fullname,
        (u: User) => u.email,
        (u: User) => (u.assignedRolesIDs || []).join(' '),
      ]),
    [usersExcludingSelf, searchTerm],
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
    handleEditUser,
    onCreateUserClick: openCreatePanel,
    onManageRoleClick: handleManageRolesClick,
    onManageGroupClick: handleManageGroupsClick,
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
    onSearchSubmit: undefined,
  });

  const isFetching = useMemo(() => users.length === 0 && loading, [users.length, loading]);

  const shouldShowEmpty = useMemo(
    () => Array.isArray(users) && users.length === 0 && !loading && !error,
    [users, loading, error],
  );

  if (error) {
    return <UsersErrorPage error={error} />;
  }

  if (shouldShowEmpty) {
    return (
      <>
        <UsersEmptyPage onCreateUserClick={openCreatePanel} />
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
      onCloseCreatePanel={closeCreatePanel}
      onCloseEditPanel={closeEditPanel}
      onCloseViewPanel={closeViewPanel}
      onCloseManageRolePanel={closeManageRolePanel}
      onCloseManageGroupPanel={closeManageGroupPanel}
      onViewPanelEdit={handleViewPanelEdit}
    />
  );
};

export default MainPage;
