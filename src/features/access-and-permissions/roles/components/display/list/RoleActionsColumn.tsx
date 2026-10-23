import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SPACING } from '../../../../../../constants';
import { ActionConfirmModal } from '../../../../../../components/display/modal';
import { RowIconButton } from '../../../../../../components/display/buttons';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import { canDeleteRole, canModifyRole } from '../../../utils';
import { usePermission, ACTION_PERMISSIONS } from '../../../../../auth/hooks';
import { useRoleActions } from '../../../hooks/actions/useRoleActions';
import { useCanChangeRoleProtection } from '../../../hooks/actions/useCanChangeRoleProtection';
import type { Role } from '../../../models';

interface RoleActionsColumnProps {
  record: Role;
  onEdit?: (record: Role) => void;
  onDelete?: (record: Role) => void;
  getUsage?: (roleId: string) => { users: number; groups: number };
}

export const RoleActionsColumn: React.FC<RoleActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
  getUsage,
}) => {
  const { handleDelete } = useRoleActions();
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
  const canChangeProtection = useCanChangeRoleProtection(record);
  // A preventModification role still opens for its creator or an Admin on ALL, to unlock it.
  const canEdit = hasEditPermission && (canModifyRole(record) || canChangeProtection);
  const isRoleProtectedFromDeletion = !canDeleteRole(record);
  const canDelete = hasDeletePermission && !isRoleProtectedFromDeletion;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit || !onEdit) return;
    onEdit(record);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canDelete) return;
    if (onDelete) {
      onDelete(record);
      return;
    }
    setConfirmOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    setDeleting(true);
    try {
      await handleDelete(record.id);
    } catch {
      // handleDelete already toasted the failure.
    } finally {
      setDeleting(false);
    }
  };

  const usage = confirmOpen ? getUsage?.(record.id) : undefined;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: SPACING.SM,
      }}
    >
      <RowIconButton
        icon={<EditOutlined />}
        label={RC.LABELS.ACTIONS.EDIT}
        tooltip={
          canEdit
            ? RC.LABELS.ACTIONS.EDIT
            : !hasEditPermission
              ? RC.LABELS.ACTIONS.EDIT_PERMISSION_DENIED_TOOLTIP
              : RC.LABELS.ACTIONS.EDIT_DISABLED_TOOLTIP
        }
        disabled={!canEdit}
        onClick={handleEditClick}
      />
      <RowIconButton
        icon={<DeleteOutlined />}
        label={RC.LABELS.ACTIONS.DELETE}
        tooltip={
          canDelete
            ? RC.LABELS.ACTIONS.DELETE
            : !hasDeletePermission
              ? RC.LABELS.ACTIONS.DELETE_PERMISSION_DENIED_TOOLTIP
              : RC.LABELS.ACTIONS.DELETE_DISABLED_TOOLTIP
        }
        disabled={!canDelete}
        onClick={handleDeleteClick}
      />
      {confirmOpen && (
        <ActionConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmDelete}
          title={RC.LABELS.DELETE_MODAL_TITLE}
          action="delete"
          resourceName={record.name}
          note={
            usage && usage.users + usage.groups > 0
              ? RC.LABELS.DELETE_IMPACT(usage.users, usage.groups)
              : undefined
          }
          confirmText={RC.LABELS.DELETE_MODAL_OK}
          loading={deleting}
          getContainer={() => document.body}
        />
      )}
    </div>
  );
};
