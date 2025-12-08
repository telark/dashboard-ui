import React from 'react';
import { Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import { useGroupMutations } from '../../../hooks';
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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(record);
    } else {
      Modal.confirm({
        title: GC.LABELS.ACTIONS.DELETE_MODAL_TITLE,
        content: GC.LABELS.ACTIONS.DELETE_MODAL_CONTENT(record.name),
        okText: GC.LABELS.ACTIONS.DELETE_MODAL_OK,
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await handleDelete(record.id);
          } catch {
            // Error message already shown by handleDelete
          }
        },
      });
    }
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
    </div>
  );
};
