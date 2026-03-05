import React from 'react';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { useUserDeleteModal, UserDeleteModal } from '../../delete';
import type { User } from '../../../models';

interface UserActionsColumnProps {
  record: User;
  onView?: (record: User) => void;
  onEdit?: (record: User) => void;
  onDelete?: (record: User) => void;
}

const actionButtonStyle: React.CSSProperties = {
  all: 'unset',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontSize: 16,
  width: 28,
  height: 28,
  borderRadius: 4,
  transition: 'all 0.2s',
  outline: 'none',
};

export const UserActionsColumn: React.FC<UserActionsColumnProps> = ({
  record,
  onView,
  onEdit,
  onDelete,
}) => {
  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useUserDeleteModal(record);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
        gap: 8,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onView?.(record);
        }}
        style={actionButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <EyeOutlined />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(record);
        }}
        style={actionButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <EditOutlined />
      </button>
      <button
        onClick={handleDeleteClick}
        style={actionButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <DeleteOutlined />
      </button>
      {!onDelete && (
        <UserDeleteModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          userName={record.fullname || record.username}
          loading={isDeleting}
        />
      )}
    </div>
  );
};
