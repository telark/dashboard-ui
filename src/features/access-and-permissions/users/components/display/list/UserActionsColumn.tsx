import React from 'react';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../../constants';
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

const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
};

const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.background = 'transparent';
};

export const UserActionsColumn: React.FC<UserActionsColumnProps> = ({
  record,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(record);
      return;
    }
    Modal.confirm({
      title: UC.LABELS.ACTIONS.DELETE_MODAL_TITLE,
      content: UC.LABELS.ACTIONS.DELETE_MODAL_CONTENT(record.fullname || record.username),
      okText: UC.LABELS.ACTIONS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: () => {},
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
      <button
        onClick={(e) => {
          e.stopPropagation();
          onView?.(record);
        }}
        style={actionButtonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <EyeOutlined />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(record);
        }}
        style={actionButtonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <EditOutlined />
      </button>
      <button
        onClick={handleDeleteClick}
        style={actionButtonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DeleteOutlined />
      </button>
    </div>
  );
};
