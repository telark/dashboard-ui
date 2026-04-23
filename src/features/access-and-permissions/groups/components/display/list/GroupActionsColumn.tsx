import React from 'react';
import { Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { usePermission, ACTION_PERMISSIONS } from '../../../../../auth/hooks';
import { useGroupDeleteModal, GroupDeleteModal } from '../../delete';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import type { Group } from '../../../models';

interface GroupActionsColumnProps {
  record: Group;
  onEdit?: (record: Group) => void;
  onDelete?: (record: Group) => void;
}

const ACTION_SIZE = 28;

const actionButtonStyle = (disabled: boolean): React.CSSProperties => ({
  all: 'unset',
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: disabled ? DEFAULT_COLORS.ICON_MUTED : DEFAULT_COLORS.TEXT_MUTED,
  fontSize: 16,
  width: ACTION_SIZE,
  height: ACTION_SIZE,
  borderRadius: 4,
  transition: 'color 0.2s, opacity 0.2s',
  outline: 'none',
  opacity: disabled ? 0.6 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
});

const actionWrapperStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: ACTION_SIZE,
  height: ACTION_SIZE,
  flexShrink: 0,
};

export const GroupActionsColumn: React.FC<GroupActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
}) => {
  const hasEditPermission = usePermission(
    ACTION_PERMISSIONS.groups.edit.scope,
    ACTION_PERMISSIONS.groups.edit.level,
    ACTION_PERMISSIONS.groups.edit.deny,
  );
  const hasDeletePermission = usePermission(
    ACTION_PERMISSIONS.groups.delete.scope,
    ACTION_PERMISSIONS.groups.delete.level,
    ACTION_PERMISSIONS.groups.delete.deny,
  );
  const canEdit = hasEditPermission && !!onEdit;
  const canDelete = hasDeletePermission;

  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useGroupDeleteModal(record);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit) return;
    onEdit?.(record);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canDelete) return;
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
      <Tooltip
        title={canEdit ? GC.LABELS.ACTIONS.EDIT : GC.LABELS.ACTIONS.EDIT_DISABLED_TOOLTIP}
        placement="left"
      >
        <span style={actionWrapperStyle}>
          <button
            type="button"
            onClick={handleEditClick}
            style={actionButtonStyle(!canEdit)}
            disabled={!canEdit}
            onMouseEnter={(e) => {
              if (canEdit) e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label={GC.LABELS.ACTIONS.EDIT}
          >
            <EditOutlined />
          </button>
        </span>
      </Tooltip>
      <Tooltip
        title={canDelete ? GC.LABELS.ACTIONS.DELETE : GC.LABELS.ACTIONS.DELETE_DISABLED_TOOLTIP}
        placement="left"
      >
        <span style={actionWrapperStyle}>
          <button
            type="button"
            onClick={handleDeleteClick}
            style={actionButtonStyle(!canDelete)}
            disabled={!canDelete}
            onMouseEnter={(e) => {
              if (canDelete) e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label={GC.LABELS.ACTIONS.DELETE}
          >
            <DeleteOutlined />
          </button>
        </span>
      </Tooltip>
      {!onDelete && (
        <GroupDeleteModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          groupName={record.name}
          loading={isDeleting}
        />
      )}
    </div>
  );
};
