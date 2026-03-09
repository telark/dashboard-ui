import React from 'react';
import { Modal } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import { deleteRoleThunk } from '../../../store';
import { canDeleteRoles } from '../../../utils';
import type { AppDispatch } from '../../../../../../store';
import type { Role } from '../../../models';

interface RoleActionsColumnProps {
  record: Role;
  onView?: (record: Role) => void;
  onEdit?: (record: Role) => void;
  onDelete?: (record: Role) => void;
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

export const RoleActionsColumn: React.FC<RoleActionsColumnProps> = ({
  record,
  onView,
  onEdit,
  onDelete,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(record);
      return;
    }
    if (!canDeleteRoles([record])) {
      Modal.warning({
        title: 'Cannot Delete',
        content: 'This role cannot be deleted due to protection flags.',
      });
      return;
    }
    Modal.confirm({
      title: RC.LABELS.DELETE_MODAL_TITLE,
      content: RC.LABELS.DELETE_MODAL_CONTENT(record.name),
      okText: RC.LABELS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: async () => {
        await dispatch(deleteRoleThunk(record.id)).unwrap();
      },
    });
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
      {onView && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView(record);
          }}
          style={actionButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title={RC.LABELS.ACTIONS.VIEW}
        >
          <EyeOutlined />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(record);
          }}
          style={actionButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title={RC.LABELS.ACTIONS.EDIT}
        >
          <EditOutlined />
        </button>
      )}
      <button
        type="button"
        onClick={handleDeleteClick}
        style={actionButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        title={RC.LABELS.ACTIONS.DELETE}
      >
        <DeleteOutlined />
      </button>
    </div>
  );
};
