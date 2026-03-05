import React, { memo, useMemo } from 'react';
import { PageLayout } from '../../../../components/display/views';
import { DEFAULT_COLORS } from '../../../../constants';
import { CreateUserPanel, EditUserPanel, ViewUserPanel } from '../panels';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import type { User, CreateUserFormValues } from '../models';
import type { FormInstance } from 'antd';

interface UsersListPageProps {
  pageConfig: PageLayoutConfig<User>;
  createPanelOpen: boolean;
  editPanelOpen: boolean;
  viewPanelOpen: boolean;
  viewingUser: User | null;
  editingUser: User | null;
  createForm: FormInstance<CreateUserFormValues>;
  editForm: FormInstance<CreateUserFormValues>;
  onCloseCreatePanel: () => void;
  onCloseEditPanel: () => void;
  onCloseViewPanel: () => void;
  onViewPanelEdit: () => void;
}

const UsersListPage: React.FC<UsersListPageProps> = memo(
  ({
    pageConfig,
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    viewingUser,
    editingUser,
    createForm,
    editForm,
    onCloseCreatePanel,
    onCloseEditPanel,
    onCloseViewPanel,
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
      </div>
    );
  },
);

UsersListPage.displayName = 'UsersListPage';

export default UsersListPage;
