import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SPACING } from '../../../../../../constants';
import { RowIconButton } from '../../../../../../components/display/buttons';
import { usePermission, ACTION_PERMISSIONS } from '../../../../../auth/hooks';
import { useGroupDeleteModal, GroupDeleteModal } from '../../delete';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
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

  const {
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    deleteImpact,
  } = useGroupDeleteModal(record);

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
        gap: SPACING.SM,
      }}
    >
      <RowIconButton
        icon={<EditOutlined />}
        label={GC.LABELS.ACTIONS.EDIT}
        tooltip={canEdit ? GC.LABELS.ACTIONS.EDIT : GC.LABELS.ACTIONS.EDIT_DISABLED_TOOLTIP}
        disabled={!canEdit}
        onClick={handleEditClick}
      />
      <RowIconButton
        icon={<DeleteOutlined />}
        label={GC.LABELS.ACTIONS.DELETE}
        tooltip={canDelete ? GC.LABELS.ACTIONS.DELETE : GC.LABELS.ACTIONS.DELETE_DISABLED_TOOLTIP}
        disabled={!canDelete}
        onClick={handleDeleteClick}
      />
      {!onDelete && (
        <GroupDeleteModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          groupName={record.name}
          loading={isDeleting}
          impact={deleteImpact}
        />
      )}
    </div>
  );
};
