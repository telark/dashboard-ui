import React, { memo, useMemo } from 'react';
import { PageLayout } from '../../../../components/display/views';
import { DEFAULT_COLORS } from '../../../../constants';
import {
  CreateRolePanel,
  EditRolePanel,
  ViewRolePanel,
} from '../panels';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import type { Role, RoleFormValues } from '../models';
import type { FormInstance } from 'antd';

interface RolesListPageProps {
  pageConfig: PageLayoutConfig<Role>;
  createPanelOpen: boolean;
  editPanelOpen: boolean;
  viewPanelOpen: boolean;
  viewingRole: Role | null;
  editingRole: Role | null;
  createForm: FormInstance<RoleFormValues>;
  editForm: FormInstance<RoleFormValues>;
  onCloseCreatePanel: () => void;
  onCloseEditPanel: () => void;
  onCloseViewPanel: () => void;
  onViewPanelEdit: () => void;
}

const RolesListPage: React.FC<RolesListPageProps> = memo(
  ({
    pageConfig,
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    viewingRole,
    editingRole,
    createForm,
    editForm,
    onCloseCreatePanel,
    onCloseEditPanel,
    onCloseViewPanel,
    onViewPanelEdit,
  }) => {
    const handleViewPanelEditClick = useMemo(
      () => (viewingRole ? onViewPanelEdit : undefined),
      [viewingRole, onViewPanelEdit],
    );

    return (
      <div style={{ background: DEFAULT_COLORS.BACKGROUND_WHITE, minHeight: '100vh' }}>
        <PageLayout config={pageConfig} />
        {createPanelOpen && (
          <CreateRolePanel open={createPanelOpen} onClose={onCloseCreatePanel} form={createForm} />
        )}
        {editPanelOpen && editingRole && (
          <EditRolePanel
            open={editPanelOpen}
            onClose={onCloseEditPanel}
            editingRole={editingRole}
            form={editForm}
          />
        )}
        {viewPanelOpen && viewingRole && (
          <ViewRolePanel
            open={viewPanelOpen}
            onClose={onCloseViewPanel}
            role={viewingRole}
            onEdit={handleViewPanelEditClick}
          />
        )}
      </div>
    );
  },
);

RolesListPage.displayName = 'RolesListPage';

export default RolesListPage;
