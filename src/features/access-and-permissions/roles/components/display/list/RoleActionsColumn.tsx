import React from 'react';
import { Modal, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import { canDeleteRole, canModifyRole } from '../../../utils';
import { usePermission, ACTION_PERMISSIONS } from '../../../../../auth/hooks';
import { useRoleActions } from '../../../hooks/actions/useRoleActions';
import type { Role } from '../../../models';

interface RoleActionsColumnProps {
  record: Role;
  onEdit?: (record: Role) => void;
  onDelete?: (record: Role) => void;
  getUsage?: (roleId: string) => { users: number; groups: number };
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

export const RoleActionsColumn: React.FC<RoleActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
  getUsage,
}) => {
  const { handleDelete } = useRoleActions({ skipNavigate: true });
  const hasEditPermission = usePermission(
    ACTION_PERMISSIONS.roles.edit.scope,
    ACTION_PERMISSIONS.roles.edit.level,
    ACTION_PERMISSIONS.roles.edit.deny,
  );
  const hasDeletePermission = usePermission(
    ACTION_PERMISSIONS.roles.delete.scope,
    ACTION_PERMISSIONS.roles.delete.level,
    ACTION_PERMISSIONS.roles.delete.deny,
  );
  const canEdit = hasEditPermission && canModifyRole(record);
  const isRoleProtectedFromDeletion = !canDeleteRole(record);
  const canDelete = hasDeletePermission && !isRoleProtectedFromDeletion;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit || !onEdit) return;
    onEdit(record);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canDelete) {
      Modal.warning({
        title: RC.LABELS.ACTIONS.CANNOT_DELETE_TITLE,
        content: RC.LABELS.ACTIONS.DELETE_DISABLED_TOOLTIP,
      });
      return;
    }
    if (onDelete) {
      onDelete(record);
      return;
    }
    const usage = getUsage?.(record.id);
    const impact =
      usage && usage.users + usage.groups > 0
        ? ` ${RC.LABELS.DELETE_IMPACT(usage.users, usage.groups)}`
        : '';
    Modal.confirm({
      title: RC.LABELS.DELETE_MODAL_TITLE,
      content: `${RC.LABELS.DELETE_MODAL_CONTENT(record.name)}${impact}`,
      okText: RC.LABELS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      // handleDelete toasts both outcomes; a rejection keeps the dialog open.
      onOk: () => handleDelete(record.id),
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
      <Tooltip
        title={
          canEdit
            ? RC.LABELS.ACTIONS.EDIT
            : !hasEditPermission
              ? RC.LABELS.ACTIONS.EDIT_PERMISSION_DENIED_TOOLTIP
              : RC.LABELS.ACTIONS.EDIT_DISABLED_TOOLTIP
        }
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
            aria-label={RC.LABELS.ACTIONS.EDIT}
          >
            <EditOutlined />
          </button>
        </span>
      </Tooltip>
      <Tooltip
        title={
          canDelete
            ? RC.LABELS.ACTIONS.DELETE
            : !hasDeletePermission
              ? RC.LABELS.ACTIONS.DELETE_PERMISSION_DENIED_TOOLTIP
              : RC.LABELS.ACTIONS.DELETE_DISABLED_TOOLTIP
        }
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
            aria-label={RC.LABELS.ACTIONS.DELETE}
          >
            <DeleteOutlined />
          </button>
        </span>
      </Tooltip>
    </div>
  );
};
