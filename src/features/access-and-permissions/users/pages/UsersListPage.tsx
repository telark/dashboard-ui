import React, { memo, useMemo } from 'react';
import { PageLayout } from '../../../../components/display/views';
import { DEFAULT_COLORS } from '../../../../constants';
import ActionConfirmModal from '../../../../components/display/modal/confirm/ActionConfirmModal';
import { FilterPanel } from '../../../../components/display/panels/filter';
import { buildUserFilterFields } from '../config/userFilterConfig';
import { USERS_CONSTANTS as UC } from '../constants';
import {
  CreateUserPanel,
  ManageUserStatePanel,
  ViewUserPanel,
  ManageUserRolePanel,
  ManageUserGroupPanel,
} from '../panels';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import type { CreateUserFormValues, ManageUserStateFormValues, User } from '../models';
import type { FormInstance } from 'antd';

interface UsersListPageProps {
  pageConfig: PageLayoutConfig<User>;
  createPanelOpen: boolean;
  editPanelOpen: boolean;
  viewPanelOpen: boolean;
  manageRolePanelOpen: boolean;
  manageGroupPanelOpen: boolean;
  viewingUser: User | null;
  editingUser: User | null;
  managingRoleUser: User | null;
  managingGroupUser: User | null;
  createForm: FormInstance<CreateUserFormValues>;
  editForm: FormInstance<ManageUserStateFormValues>;
  filterPanelOpen: boolean;
  appliedFilters: Record<string, unknown>;
  bulkDeleteModalOpen: boolean;
  bulkDeleteSelectedCount: number;
  bulkDeleteIsDeleting: boolean;
  onCloseCreatePanel: () => void;
  onCloseEditPanel: () => void;
  onCloseViewPanel: () => void;
  onCloseManageRolePanel: () => void;
  onCloseManageGroupPanel: () => void;
  onCloseFilterPanel: () => void;
  onCloseBulkDeleteModal: () => void;
  onConfirmBulkDelete: () => Promise<void>;
  handleFilterChange: (filters: Record<string, unknown>) => void;
  handleFilterApply: (filters: Record<string, unknown>) => void;
  handleFilterReset: () => void;
  onViewPanelEdit?: () => void;
  canDeleteUser?: boolean;
}

const filterFields = buildUserFilterFields();

const UsersListPage: React.FC<UsersListPageProps> = memo(
  ({
    pageConfig,
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
    filterPanelOpen,
    appliedFilters,
    bulkDeleteModalOpen,
    bulkDeleteSelectedCount,
    bulkDeleteIsDeleting,
    onCloseCreatePanel,
    onCloseEditPanel,
    onCloseViewPanel,
    onCloseManageRolePanel,
    onCloseManageGroupPanel,
    onCloseFilterPanel,
    onCloseBulkDeleteModal,
    onConfirmBulkDelete,
    handleFilterChange,
    handleFilterApply,
    handleFilterReset,
    onViewPanelEdit,
    canDeleteUser,
  }) => {
    const handleViewPanelEditClick = useMemo(
      () => (viewingUser && onViewPanelEdit ? onViewPanelEdit : undefined),
      [viewingUser, onViewPanelEdit],
    );

    const bulkDeleteResourceName = useMemo(
      () => `${bulkDeleteSelectedCount} user${bulkDeleteSelectedCount > 1 ? 's' : ''}`,
      [bulkDeleteSelectedCount],
    );

    return (
      <div style={{ background: DEFAULT_COLORS.BACKGROUND_WHITE, minHeight: '100vh' }}>
        <PageLayout config={pageConfig} />
        {createPanelOpen && (
          <CreateUserPanel open={createPanelOpen} onClose={onCloseCreatePanel} form={createForm} />
        )}
        {editPanelOpen && editingUser && (
          <ManageUserStatePanel
            open={editPanelOpen}
            onClose={onCloseEditPanel}
            editingUser={editingUser}
            form={editForm}
          />
        )}
        {viewPanelOpen && viewingUser && (
          <ViewUserPanel
            open={viewPanelOpen}
            onClose={onCloseViewPanel}
            user={viewingUser}
            onEdit={handleViewPanelEditClick}
            canDelete={canDeleteUser}
          />
        )}
        {manageRolePanelOpen && managingRoleUser && (
          <ManageUserRolePanel
            open={manageRolePanelOpen}
            onClose={onCloseManageRolePanel}
            user={managingRoleUser}
          />
        )}
        {manageGroupPanelOpen && managingGroupUser && (
          <ManageUserGroupPanel
            open={manageGroupPanelOpen}
            onClose={onCloseManageGroupPanel}
            user={managingGroupUser}
          />
        )}
        <FilterPanel
          open={filterPanelOpen}
          onClose={onCloseFilterPanel}
          fields={filterFields}
          value={appliedFilters}
          onFilterChange={handleFilterChange}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
        />
        {bulkDeleteModalOpen && (
          <ActionConfirmModal
            open={bulkDeleteModalOpen}
            onClose={onCloseBulkDeleteModal}
            onConfirm={onConfirmBulkDelete}
            title={UC.LABELS.ACTIONS.BULK_DELETE_MODAL_TITLE}
            action="delete"
            resourceName={bulkDeleteResourceName}
            confirmText={UC.LABELS.ACTIONS.DELETE_MODAL_OK}
            cancelText={UC.LABELS.MODAL.CANCEL}
            loading={bulkDeleteIsDeleting}
            danger={true}
          />
        )}
      </div>
    );
  },
);

UsersListPage.displayName = 'UsersListPage';

export default UsersListPage;
