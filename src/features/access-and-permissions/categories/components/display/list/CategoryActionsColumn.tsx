import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SPACING } from '../../../../../../constants';
import { RowIconButton } from '../../../../../../components/display/buttons';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { CATEGORIES_CONSTANTS as CC, labelsFor } from '../../../constants';
import type { CategoryScope } from '../../../constants';
import { useCategoryDeleteModal, CategoryDeleteModal } from '../../delete';
import { useCategoryPermissions } from '../../../hooks';
import type { Category } from '../../../models';

interface CategoryActionsColumnProps {
  record: Category;
  onEdit?: (record: Category) => void;
  onDelete?: (record: Category) => void;
  scope: CategoryScope;
}

export const CategoryActionsColumn: React.FC<CategoryActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
  scope,
}) => {
  const isBuiltIn = record.type === CC.TYPES.BUILT_IN;
  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useCategoryDeleteModal(record);

  const { canEdit: hasEditPermission, canDelete: hasDeletePermission } =
    useCategoryPermissions(scope);
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
