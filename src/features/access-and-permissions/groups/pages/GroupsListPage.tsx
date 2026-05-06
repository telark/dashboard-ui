import React, { memo, useMemo } from 'react';
import { PageLayout } from '../../../../components/display/views';
import {
  CreateGroupPanel,
  EditGroupPanel,
  ViewGroupPanel,
  AttachRolePanel,
  AttachMemberPanel,
} from '../panels';
import { AddCategoryPanel, EditCategoryPanel } from '../../categories/panels';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import ActionConfirmModal from '../../../../components/display/modal/confirm/ActionConfirmModal';
import { FilterPanel } from '../../../../components/display/panels/filter';
import { buildGroupFilterFields } from '../config/groupFilterConfig';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { DEFAULT_COLORS } from '../../../../constants';
import type { Group } from '../models';
import type { Category } from '../../categories/models';
import type { FormInstance } from 'antd';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';

interface GroupsListPageProps {
  pageConfig: PageLayoutConfig<Group | Category>;
  createPanelOpen: boolean;
  editPanelOpen: boolean;
  viewPanelOpen: boolean;
  attachRolePanelOpen: boolean;
  attachMemberPanelOpen: boolean;
  viewingGroup: Group | null;
  editingGroup: Group | null;
  attachingRoleGroup: Group | null;
  attachingMemberGroup: Group | null;
  createForm: FormInstance;
  editForm: FormInstance;
  filterPanelOpen: boolean;
  categoryOptions: Array<{ label: string; value: string }>;
  bulkDeleteModalOpen: boolean;
  selectedCount: number;
  isDeleting: boolean;
  addCategoryPanelOpen: boolean;
  editCategoryPanelOpen: boolean;
  editingCategory: Category | null;
  onCloseCreatePanel: () => void;
  onCloseAddCategoryPanel: () => void;
  onCloseEditCategoryPanel: () => void;
  onCloseEditPanel: () => void;
  onCloseViewPanel: () => void;
  onCloseAttachRolePanel: () => void;
  onCloseAttachMemberPanel: () => void;
  onCloseFilterPanel: () => void;
  onCloseBulkDeleteModal: () => void;
  onConfirmBulkDelete: () => Promise<void>;
  onViewPanelEdit?: (group: Group) => void;
  canDeleteGroup?: boolean;
  handleFilterChange: (filters: Record<string, unknown>) => void;
  handleFilterApply: (filters: Record<string, unknown>) => void;
  handleFilterReset: () => void;
}

const GroupsListPage: React.FC<GroupsListPageProps> = memo(
  ({
    pageConfig,
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    attachRolePanelOpen,
    attachMemberPanelOpen,
    viewingGroup,
    editingGroup,
    attachingRoleGroup,
    attachingMemberGroup,
    createForm,
    editForm,
    filterPanelOpen,
    categoryOptions,
    bulkDeleteModalOpen,
    selectedCount,
    isDeleting,
    addCategoryPanelOpen,
    editCategoryPanelOpen,
    editingCategory,
    onCloseCreatePanel,
    onCloseAddCategoryPanel,
    onCloseEditCategoryPanel,
    onCloseEditPanel,
    onCloseViewPanel,
    onCloseAttachRolePanel,
    onCloseAttachMemberPanel,
    onCloseFilterPanel,
    onCloseBulkDeleteModal,
    onConfirmBulkDelete,
    onViewPanelEdit,
    canDeleteGroup,
    handleFilterChange,
    handleFilterApply,
    handleFilterReset,
  }) => {
    const filterFields = useMemo(() => buildGroupFilterFields(categoryOptions), [categoryOptions]);

    const resourceName = useMemo(
      () => `${selectedCount} group${selectedCount > 1 ? 's' : ''}`,
      [selectedCount],
    );

    const handleViewPanelEditClick = useMemo(
      () => (viewingGroup && onViewPanelEdit ? () => onViewPanelEdit(viewingGroup) : undefined),
      [viewingGroup, onViewPanelEdit],
    );

    return (
      <div style={{ background: DEFAULT_COLORS.BACKGROUND_WHITE, minHeight: '100vh' }}>
        <PageLayout config={pageConfig} />
        {createPanelOpen && (
          <CreateGroupPanel open={createPanelOpen} onClose={onCloseCreatePanel} form={createForm} />
        )}
        {editPanelOpen && editingGroup && (
          <EditGroupPanel
            open={editPanelOpen}
            onClose={onCloseEditPanel}
            editingGroup={editingGroup}
            form={editForm}
          />
        )}
        {addCategoryPanelOpen && (
          <AddCategoryPanel
            open={addCategoryPanelOpen}
            onClose={onCloseAddCategoryPanel}
            scope={CATEGORIES_CONSTANTS.SCOPES.GROUPS}
          />
        )}
        {editCategoryPanelOpen && (
          <EditCategoryPanel
            open={editCategoryPanelOpen}
            onClose={onCloseEditCategoryPanel}
            editingCategory={editingCategory}
          />
        )}
        {viewPanelOpen && viewingGroup && (
          <ViewGroupPanel
            open={viewPanelOpen}
            onClose={onCloseViewPanel}
            group={viewingGroup}
            onEdit={handleViewPanelEditClick}
            canDelete={canDeleteGroup}
          />
        )}
        {attachRolePanelOpen && attachingRoleGroup && (
          <AttachRolePanel
            open={attachRolePanelOpen}
            onClose={onCloseAttachRolePanel}
            group={attachingRoleGroup}
          />
        )}
        {attachMemberPanelOpen && attachingMemberGroup && (
          <AttachMemberPanel
            open={attachMemberPanelOpen}
            onClose={onCloseAttachMemberPanel}
            group={attachingMemberGroup}
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
        {bulkDeleteModalOpen && (
          <ActionConfirmModal
            open={bulkDeleteModalOpen}
            onClose={onCloseBulkDeleteModal}
            onConfirm={onConfirmBulkDelete}
            title={GC.LABELS.ACTIONS.BULK_DELETE_MODAL_TITLE}
            action="delete"
            resourceName={resourceName}
            confirmText={GC.LABELS.ACTIONS.DELETE_MODAL_OK}
            cancelText={GC.LABELS.MODAL.CANCEL}
            loading={isDeleting}
            danger={true}
          />
        )}
      </div>
    );
  },
);

GroupsListPage.displayName = 'GroupsListPage';

export default GroupsListPage;
