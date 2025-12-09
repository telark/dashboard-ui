import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import { useGroupMutations } from '../../../hooks';
import ActionConfirmModal from '../../../../../../components/display/modal/ActionConfirmModal';
import type { Group } from '../../../models';

interface GroupActionsColumnProps {
  record: Group;
  onEdit?: (record: Group) => void;
  onDelete?: (record: Group) => void;
}

export const GroupActionsColumn: React.FC<GroupActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
}) => {
  const { handleDelete } = useGroupMutations();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(record);
    } else {
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDelete(record.id);
      setDeleteModalOpen(false);
    } catch {
      // Error message already shown by handleDelete
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setDeleteModalOpen(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
      }}
    >
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
      {!onDelete && (
        <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <ActionConfirmModal
            open={deleteModalOpen}
            onClose={handleModalClose}
            onConfirm={handleConfirmDelete}
            title={GC.LABELS.ACTIONS.DELETE_MODAL_TITLE}
            action="delete"
            resourceName={record.name}
            resourceType="group"
            confirmText={GC.LABELS.ACTIONS.DELETE_MODAL_OK}
            loading={isDeleting}
          />
        </div>
      )}
    </div>
  );
};
