import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SPACING } from '../../../../../../constants';
import { RowIconButton } from '../../../../../../components/display/buttons';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { CATEGORIES_CONSTANTS as CC, labelsFor } from '../../../constants';
import type { CategoryScope } from '../../../constants';
import { useCategoryDeleteModal, CategoryDeleteModal } from '../../delete';
import type { Category } from '../../../models';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../../auth/hooks/permissions/permissionEngine';
import type { PermissionLevel } from '../../../../../auth/models/permissions';

interface CategoryActionsColumnProps {
  record: Category;
  onEdit?: (record: Category) => void;
  onDelete?: (record: Category) => void;
  scope: CategoryScope;
}

type PermissionEntry = { scope: string; level: PermissionLevel; deny: string };

const PERMISSIONS_BY_SCOPE: Record<
  CategoryScope,
  { edit: PermissionEntry; delete: PermissionEntry }
> = {
  [CC.SCOPES.GROUPS]: {
    edit: ACTION_PERMISSIONS.groups.editCategory,
    delete: ACTION_PERMISSIONS.groups.deleteCategory,
  },
  [CC.SCOPES.ROLES]: {
    edit: ACTION_PERMISSIONS.roles.editCategory,
    delete: ACTION_PERMISSIONS.roles.deleteCategory,
  },
  [CC.SCOPES.PLAN_KINDS]: {
    edit: ACTION_PERMISSIONS.protectionPlans.editCategory,
    delete: ACTION_PERMISSIONS.protectionPlans.deleteCategory,
  },
  [CC.SCOPES.PLAN_ENVIRONMENTS]: {
    edit: ACTION_PERMISSIONS.protectionPlans.editCategory,
    delete: ACTION_PERMISSIONS.protectionPlans.deleteCategory,
  },
  [CC.SCOPES.PLAN_TAGS]: {
    edit: ACTION_PERMISSIONS.protectionPlans.editCategory,
    delete: ACTION_PERMISSIONS.protectionPlans.deleteCategory,
  },
};

export const CategoryActionsColumn: React.FC<CategoryActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
  scope,
}) => {
  const isBuiltIn = record.type === CC.TYPES.BUILT_IN;
  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useCategoryDeleteModal(record);

  const { edit, delete: del } = PERMISSIONS_BY_SCOPE[scope];
  const hasEditPermission = usePermission(edit.scope, edit.level, edit.deny);
  const hasDeletePermission = usePermission(del.scope, del.level, del.deny);
  const L = labelsFor(scope);

  const showEdit = !isBuiltIn && !!onEdit;
  const showDelete = !isBuiltIn;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasEditPermission) return;
    onEdit?.(record);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hasDeletePermission) return;
    if (onDelete) {
      onDelete(record);
    } else {
      openDeleteModal();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: SPACING.MD,
      }}
    >
      {showEdit && (
        <RowIconButton
          icon={<EditOutlined />}
          label={RC.LABELS.ACTIONS.EDIT}
          tooltip={
            hasEditPermission ? RC.LABELS.ACTIONS.EDIT : L.ACTIONS.EDIT_PERMISSION_DENIED_TOOLTIP
          }
          disabled={!hasEditPermission}
          onClick={handleEditClick}
        />
      )}
      {showDelete && (
        <RowIconButton
          icon={<DeleteOutlined />}
          label={RC.LABELS.ACTIONS.DELETE}
          tooltip={
            hasDeletePermission
              ? RC.LABELS.ACTIONS.DELETE
              : L.ACTIONS.DELETE_PERMISSION_DENIED_TOOLTIP
          }
          disabled={!hasDeletePermission}
          onClick={handleDeleteClick}
        />
      )}
      {!onDelete && (
        <CategoryDeleteModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          categoryName={record.name}
          loading={isDeleting}
          scope={record.scope}
        />
      )}
    </div>
  );
};
