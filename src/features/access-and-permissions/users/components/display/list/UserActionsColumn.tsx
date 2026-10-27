import React from 'react';
import { Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { UserSwitchOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { MODAL_CHROME, TIME_FORMATS, SPACING } from '../../../../../../constants';
import { ActionConfirmModal } from '../../../../../../components/display/modal';
import { RowIconButton } from '../../../../../../components/display/buttons';
import { formatDateTime } from '../../../../../../utils/shared/time';
import { usePermission, ACTION_PERMISSIONS } from '../../../../../auth/hooks';
import { EnrollLinkModal } from '../../../../../auth/components';
import { useUserDeleteModal, UserDeleteModal } from '../../delete';
import { USERS_CONSTANTS as UC } from '../../../constants';
import type { User } from '../../../models';
import { useUserLockReason } from '../../../hooks/user/useUserLockReason';
import { useUserEnrollLink } from '../../../hooks/user/useUserEnrollLink';

interface UserActionsColumnProps {
  record: User;
  onEdit?: (record: User) => void;
}

const ENROLL = UC.LABELS.ENROLL_LINK;

const menuLabel = (label: string, blockedReason?: string) =>
  blockedReason ? (
    // Left of the item: above or below, it would cover the neighboring item.
    <Tooltip title={blockedReason} placement="left">
      <span style={{ pointerEvents: 'all' }}>{label}</span>
    </Tooltip>
  ) : (
    label
  );

// The menu and the dialogs render in portals, and their clicks still bubble to the row.
const stopRowClick = (e: React.MouseEvent) => e.stopPropagation();

interface EnrollLinkActionProps {
  record: User;
}

const EnrollLinkAction: React.FC<EnrollLinkActionProps> = ({ record }) => {
  const link = useUserEnrollLink(record);
  const blocked = Boolean(link.blocked);

  const items: MenuProps['items'] = [
    {
      key: UC.KEYS.ENROLL_LINK_CREATE,
      label: menuLabel(ENROLL.CREATE, link.createBlocked),
      disabled: Boolean(link.createBlocked),
    },
    {
      key: UC.KEYS.ENROLL_LINK_REVOKE,
      label: menuLabel(ENROLL.REVOKE, link.revokeBlocked),
      disabled: Boolean(link.revokeBlocked),
      danger: true,
    },
  ];
  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === UC.KEYS.ENROLL_LINK_CREATE) link.create();
    if (key === UC.KEYS.ENROLL_LINK_REVOKE) link.openRevoke();
  };

  return (
    // Adds no box: it only catches the clicks that bubble up from the portals.
    <span style={{ display: 'contents' }} onClick={stopRowClick}>
      <RowIconButton
        icon={<LinkOutlined />}
        label={ENROLL.MENU}
        tooltip={link.blocked ?? ENROLL.MENU}
        disabled={blocked}
        menu={{ items, onClick: onMenuClick }}
      />
      <EnrollLinkModal
        url={link.url}
        onClose={link.closeLink}
        title={ENROLL.MODAL_TITLE}
        description={
          <>
            {ENROLL.MODAL_SEND_TO}
            <span style={MODAL_CHROME.RESOURCE_NAME}>{record.username}</span>
            {ENROLL.MODAL_EXPIRES(formatDateTime(link.expiresAt, TIME_FORMATS.DATE_TIME))}
          </>
        }
      />
      <ActionConfirmModal
        open={link.revokeOpen}
        onClose={link.closeRevoke}
        onConfirm={link.revoke}
        title={ENROLL.REVOKE}
        action={ENROLL.REVOKE_ACTION}
        resourceType={ENROLL.REVOKE_RESOURCE}
        resourceName={record.username}
        confirmText={ENROLL.REVOKE_CONFIRM}
        cancelText={UC.LABELS.MODAL.CANCEL}
        note={ENROLL.REVOKE_NOTE}
        loading={link.revoking}
        getContainer={() => document.body}
      />
    </span>
  );
};

export const UserActionsColumn: React.FC<UserActionsColumnProps> = ({ record, onEdit }) => {
  const hasSuspendPermission = usePermission(
    ACTION_PERMISSIONS.users.suspend.scope,
    ACTION_PERMISSIONS.users.suspend.level,
    ACTION_PERMISSIONS.users.suspend.deny,
  );
  const hasDeletePermission = usePermission(
    ACTION_PERMISSIONS.users.delete.scope,
    ACTION_PERMISSIONS.users.delete.level,
    ACTION_PERMISSIONS.users.delete.deny,
  );
  const lockReason = useUserLockReason()(record);
  const canEdit = hasSuspendPermission && !!onEdit && !lockReason;
  const canDelete = hasDeletePermission && !lockReason;

  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useUserDeleteModal(record);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit) return;
    onEdit?.(record);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canDelete) return;
    openDeleteModal();
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
      <EnrollLinkAction record={record} />
      <RowIconButton
        icon={<UserSwitchOutlined />}
        label={UC.LABELS.ACTIONS.MANAGE_STATE}
        tooltip={
          canEdit
            ? UC.LABELS.ACTIONS.MANAGE_STATE
            : (lockReason ?? UC.LABELS.ACTIONS.EDIT_DISABLED_TOOLTIP)
        }
        disabled={!canEdit}
        onClick={handleEditClick}
      />
      <RowIconButton
        icon={<DeleteOutlined />}
        label={UC.LABELS.ACTIONS.DELETE}
        tooltip={
          canDelete
            ? UC.LABELS.ACTIONS.DELETE
            : (lockReason ?? UC.LABELS.ACTIONS.DELETE_DISABLED_TOOLTIP)
        }
        disabled={!canDelete}
        onClick={handleDeleteClick}
      />
      <UserDeleteModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        userName={record.fullname || record.username}
        loading={isDeleting}
      />
    </div>
  );
};
