import React, { memo, useMemo } from 'react';
import { PageLayout } from '../../../../components/display/views';
import { DEFAULT_COLORS } from '../../../../constants';
import {
  CreateUserPanel,
  EditUserPanel,
  ViewUserPanel,
  ManageUserRolePanel,
  ManageUserGroupPanel,
} from '../panels';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import type { User, CreateUserFormValues } from '../models';
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
  editForm: FormInstance<CreateUserFormValues>;
  onCloseCreatePanel: () => void;
  onCloseEditPanel: () => void;
  onCloseViewPanel: () => void;
  onCloseManageRolePanel: () => void;
  onCloseManageGroupPanel: () => void;
  onViewPanelEdit: () => void;
}

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
    onCloseCreatePanel,
    onCloseEditPanel,
    onCloseViewPanel,
    onCloseManageRolePanel,
    onCloseManageGroupPanel,
    onViewPanelEdit,
  }) => {
    const handleViewPanelEditClick = useMemo(
      () => (viewingUser ? onViewPanelEdit : undefined),
      [viewingUser, onViewPanelEdit],
    );

    return (
      <div style={{ background: DEFAULT_COLORS.BACKGROUND_WHITE, minHeight: '100vh' }}>
        <PageLayout config={pageConfig} />
        {createPanelOpen && (
          <CreateUserPanel open={createPanelOpen} onClose={onCloseCreatePanel} form={createForm} />
        )}
        {editPanelOpen && editingUser && (
          <EditUserPanel
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
      </div>
    );
  },
);

UsersListPage.displayName = 'UsersListPage';

export default UsersListPage;
