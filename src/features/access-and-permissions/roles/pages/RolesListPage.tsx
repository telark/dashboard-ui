import React, { memo, useMemo } from 'react';
import { PageLayout } from '../../../../components/display/views';
import { DEFAULT_COLORS } from '../../../../constants';
import { FilterPanel } from '../../../../components/display/panels/filter';
import { buildAttachRoleFilterFields } from '../../groups/config/attachRoleFilterConfig';
import { useRoleCategoryOptions } from '../../groups/hooks/categories/useRoleCategoryOptions';
import { CreateRolePanel, EditRolePanel, ViewRolePanel, AddRoleCategoryPanel } from '../panels';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import type { Category } from '../../categories/models';
import type { Role, RoleFormValues } from '../models';
import type { FormInstance } from 'antd';

interface RolesListPageProps {
  pageConfig: PageLayoutConfig<Role | Category>;
  createPanelOpen: boolean;
  editPanelOpen: boolean;
  viewPanelOpen: boolean;
  viewingRole: Role | null;
  editingRole: Role | null;
  createForm: FormInstance<RoleFormValues>;
  editForm: FormInstance<RoleFormValues>;
  filterPanelOpen: boolean;
  addCategoryPanelOpen: boolean;
  onCloseCreatePanel: () => void;
  onCloseEditPanel: () => void;
  onCloseViewPanel: () => void;
  onCloseFilterPanel: () => void;
  onCloseAddCategoryPanel: () => void;
  handleFilterChange: (filters: Record<string, unknown>) => void;
  handleFilterApply: (filters: Record<string, unknown>) => void;
  handleFilterReset: () => void;
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
    filterPanelOpen,
    addCategoryPanelOpen,
    onCloseCreatePanel,
    onCloseEditPanel,
    onCloseViewPanel,
    onCloseFilterPanel,
    onCloseAddCategoryPanel,
    handleFilterChange,
    handleFilterApply,
    handleFilterReset,
    onViewPanelEdit,
  }) => {
    const { categoryOptions } = useRoleCategoryOptions();
    const filterFields = useMemo(
      () => buildAttachRoleFilterFields(categoryOptions),
      [categoryOptions],
    );

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
        <FilterPanel
          open={filterPanelOpen}
          onClose={onCloseFilterPanel}
          fields={filterFields}
          onFilterChange={handleFilterChange}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
        />
        {addCategoryPanelOpen && (
          <AddRoleCategoryPanel open={addCategoryPanelOpen} onClose={onCloseAddCategoryPanel} />
        )}
      </div>
    );
  },
);

RolesListPage.displayName = 'RolesListPage';

export default RolesListPage;
