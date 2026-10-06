import React, { useState } from 'react';
import { Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  MODAL_CHROME,
  ROW_ACTION_CLASS,
  TIME_FORMATS,
} from '../../../../../../constants';
import { ActionConfirmModal } from '../../../../../../components/display/modal';
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
  onDelete?: (record: User) => void;
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
  const [menuOpen, setMenuOpen] = useState(false);
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
    <span style={actionWrapperStyle} onClick={stopRowClick}>
      {/* Hovering the open menu counts as hovering its trigger, so the label waits for it to close. */}
      <Tooltip
        title={link.blocked ?? ENROLL.MENU}
        placement="left"
        open={menuOpen ? false : undefined}
      >
        <span style={actionWrapperStyle}>
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            disabled={blocked}
            open={menuOpen}
            onOpenChange={setMenuOpen}
            menu={{ items, onClick: onMenuClick }}
          >
            <button
              type="button"
              className={ROW_ACTION_CLASS}
              style={actionButtonStyle(blocked)}
              disabled={blocked}
              onMouseEnter={(e) => {
                if (!blocked) e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              aria-label={ENROLL.MENU}
            >
              <LinkOutlined />
            </button>
          </Dropdown>
        </span>
      </Tooltip>
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

export const UserActionsColumn: React.FC<UserActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
}) => {
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
      <EnrollLinkAction record={record} />
      <Tooltip
        title={
          canEdit ? UC.LABELS.ACTIONS.EDIT : (lockReason ?? UC.LABELS.ACTIONS.EDIT_DISABLED_TOOLTIP)
        }
        placement="left"
      >
        <span style={actionWrapperStyle}>
          <button
            type="button"
            onClick={handleEditClick}
            className={ROW_ACTION_CLASS}
            style={actionButtonStyle(!canEdit)}
            disabled={!canEdit}
            onMouseEnter={(e) => {
              if (canEdit) e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label={UC.LABELS.ACTIONS.EDIT}
          >
            <EditOutlined />
          </button>
        </span>
      </Tooltip>
      <Tooltip
        title={
          canDelete
            ? UC.LABELS.ACTIONS.DELETE
            : (lockReason ?? UC.LABELS.ACTIONS.DELETE_DISABLED_TOOLTIP)
        }
        placement="left"
      >
        <span style={actionWrapperStyle}>
          <button
            type="button"
            onClick={handleDeleteClick}
            className={ROW_ACTION_CLASS}
            style={actionButtonStyle(!canDelete)}
            disabled={!canDelete}
            onMouseEnter={(e) => {
              if (canDelete) e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label={UC.LABELS.ACTIONS.DELETE}
          >
            <DeleteOutlined />
          </button>
        </span>
      </Tooltip>
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
