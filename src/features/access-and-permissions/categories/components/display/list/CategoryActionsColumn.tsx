import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { CATEGORIES_CONSTANTS as CC } from '../../../constants';
import { useCategoryDeleteModal, CategoryDeleteModal } from '../../delete';
import type { Category } from '../../../models';

interface CategoryActionsColumnProps {
  record: Category;
  onEdit?: (record: Category) => void;
  onDelete?: (record: Category) => void;
}

export const CategoryActionsColumn: React.FC<CategoryActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
}) => {
  const isBuiltIn = record.type === CC.TYPES.BUILT_IN;
  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useCategoryDeleteModal(record);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(record);
    } else {
      openDeleteModal();
    }
  };

  const showEdit = !isBuiltIn && onEdit;
  const showDelete = !isBuiltIn;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
      }}
    >
      {showEdit && (
        <Tooltip title={RC.LABELS.ACTIONS.EDIT} placement="left">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(record);
            }}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: 16,
              width: 28,
              height: 28,
              borderRadius: 4,
              transition: 'all 0.2s',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
          >
            <EditOutlined />
          </button>
        </Tooltip>
      )}
      {showDelete && (
        <Tooltip title={RC.LABELS.ACTIONS.DELETE} placement="left">
          <button
            onClick={handleDeleteClick}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: 16,
              width: 28,
              height: 28,
              borderRadius: 4,
              transition: 'all 0.2s',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
          >
            <DeleteOutlined />
          </button>
        </Tooltip>
      )}
      {!onDelete && (
        <CategoryDeleteModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          categoryName={record.name}
          loading={isDeleting}
        />
      )}
    </div>
  );
};
