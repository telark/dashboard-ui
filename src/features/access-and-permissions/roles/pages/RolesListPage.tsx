import React, { memo, useMemo } from 'react';
import { PageLayout } from '../../../../components/display/views';
import { DEFAULT_COLORS } from '../../../../constants';
import { FilterPanel } from '../../../../components/display/panels/filter';
import ActionConfirmModal from '../../../../components/display/modal/confirm/ActionConfirmModal';
import { ROLES_CONSTANTS as RC } from '../constants';
import { buildAttachRoleFilterFields } from '../../groups/config/attachRoleFilterConfig';
import { useRoleCategoryOptions } from '../../groups/hooks/categories/useRoleCategoryOptions';
import { CreateRolePanel, EditRolePanel, ViewRolePanel } from '../panels';
import { AddCategoryPanel, EditCategoryPanel } from '../../categories/panels';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
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
  appliedFilters: Record<string, unknown>;
  addCategoryPanelOpen: boolean;
  editCategoryPanelOpen: boolean;
  editingCategory: Category | null;
  onCloseCreatePanel: () => void;
  onCloseEditPanel: () => void;
  onCloseViewPanel: () => void;
  onCloseFilterPanel: () => void;
  onCloseAddCategoryPanel: () => void;
  onCloseEditCategoryPanel: () => void;
  handleFilterChange: (filters: Record<string, unknown>) => void;
  handleFilterApply: (filters: Record<string, unknown>) => void;
  handleFilterReset: () => void;
  onViewPanelEdit?: () => void;
  bulkDeleteModalOpen: boolean;
  bulkDeleteSelectedCount: number;
  bulkDeleteIsDeleting: boolean;
  onCloseBulkDeleteModal: () => void;
  onConfirmBulkDelete: () => Promise<void>;
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
    appliedFilters,
    addCategoryPanelOpen,
    editCategoryPanelOpen,
    editingCategory,
    onCloseCreatePanel,
    onCloseEditPanel,
    onCloseViewPanel,
    onCloseFilterPanel,
    onCloseAddCategoryPanel,
    onCloseEditCategoryPanel,
    handleFilterChange,
    handleFilterApply,
    handleFilterReset,
    onViewPanelEdit,
    bulkDeleteModalOpen,
    bulkDeleteSelectedCount,
    bulkDeleteIsDeleting,
    onCloseBulkDeleteModal,
    onConfirmBulkDelete,
  }) => {
    const { categoryOptions } = useRoleCategoryOptions();
    const filterFields = useMemo(
      () => buildAttachRoleFilterFields(categoryOptions),
      [categoryOptions],
    );

    const handleViewPanelEditClick = useMemo(
      () => (viewingRole && onViewPanelEdit ? onViewPanelEdit : undefined),
      [viewingRole, onViewPanelEdit],
    );

    return (
      <div style={{ background: DEFAULT_COLORS.PAGE_BG, minHeight: '100vh' }}>
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
          value={appliedFilters}
          onFilterChange={handleFilterChange}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
        />
        {addCategoryPanelOpen && (
          <AddCategoryPanel
            open={addCategoryPanelOpen}
            onClose={onCloseAddCategoryPanel}
            scope={CATEGORIES_CONSTANTS.SCOPES.ROLES}
          />
        )}
        {editCategoryPanelOpen && editingCategory && (
          <EditCategoryPanel
            open={editCategoryPanelOpen}
            onClose={onCloseEditCategoryPanel}
            editingCategory={editingCategory}
          />
        )}
        {bulkDeleteModalOpen && (
          <ActionConfirmModal
            open={bulkDeleteModalOpen}
            onClose={onCloseBulkDeleteModal}
            onConfirm={onConfirmBulkDelete}
            title={RC.LABELS.ACTIONS.BULK_DELETE_MODAL_TITLE}
            action="delete"
            resourceName={RC.LABELS.ACTIONS.BULK_DELETE_RESOURCE(bulkDeleteSelectedCount)}
            note={RC.LABELS.ACTIONS.BULK_DELETE_NOTE}
            confirmText={RC.LABELS.DELETE_MODAL_OK}
            cancelText={RC.LABELS.ACTIONS.CANCEL}
            loading={bulkDeleteIsDeleting}
            danger
          />
        )}
      </div>
    );
  },
);

RolesListPage.displayName = 'RolesListPage';

export default RolesListPage;
