import React, { useMemo } from 'react';
import { Tag } from 'antd';
import {
  DEFAULT_COLORS,
  EMPTY_VALUE,
  Icons,
  TAG_CLASS,
  getPillColor,
} from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import ViewPanel from '../../../../../components/display/panels/view/ViewPanel';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import UserAvatar from '../../../../../components/display/avatars/UserAvatar';
import { useUserDeleteModal, UserDeleteModal } from '../../components/delete';
import type { ViewDetailRow } from '../../../../../components/display/panels/view/types';
import type { User } from '../../models';
import { useUserLockReason } from '../../hooks/user/useUserLockReason';
import BootstrapPill from '../../components/display/shared/BootstrapPill';

interface ViewUserPanelProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onEdit?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

const UserIcon = Icons.User;
// A disabled action still needs a handler to render; its click is swallowed.
const noop = () => undefined;

const ViewUserPanel: React.FC<ViewUserPanelProps> = ({
  open,
  onClose,
  user,
  onEdit,
  onDelete,
  canDelete,
}) => {
  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useUserDeleteModal(user);

  const lockReasonFor = useUserLockReason();

  // Both actions always show; a missing permission or a protected account disables them instead.
  const actions = useMemo(() => {
    const lockReason = user ? lockReasonFor(user) : undefined;
    return {
      onEdit: onEdit ?? noop,
      onDelete: onDelete ?? openDeleteModal,
      editDisabledReason: onEdit ? lockReason : UC.LABELS.ACTIONS.EDIT_DISABLED_TOOLTIP,
      deleteDisabledReason: canDelete ? lockReason : UC.LABELS.ACTIONS.DELETE_DISABLED_TOOLTIP,
    };
  }, [user, lockReasonFor, onEdit, onDelete, canDelete, openDeleteModal]);

  const icon = useMemo(() => {
    if (!user) return <UserIcon size={32} style={{ color: DEFAULT_COLORS.SUCCESS }} />;
    return <UserAvatar avatar={user.avatar} username={user.username} size={48} />;
  }, [user]);

  const details = useMemo<ViewDetailRow[]>(() => {
    if (!user) return [];

    const isActive = user.status.phase === 'active';

    return [
      {
        label: UC.LABELS.VIEW_LABELS.USERNAME,
        value: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_ON_SURFACE }}>
              {user.username}
            </span>
            {user.bootstrap && <BootstrapPill />}
          </span>
        ),
      },
      {
        label: UC.LABELS.VIEW_LABELS.STATUS,
        value: (
          <Tag
            color={getPillColor(isActive ? DEFAULT_COLORS.SUCCESS : undefined)}
            className={TAG_CLASS.MEDIUM}
          >
            {user.status.phase}
          </Tag>
        ),
      },
      {
        label: UC.LABELS.VIEW_LABELS.CREATION_DATE,
        value: (
          <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_ON_SURFACE }}>
            {user.creationDate ? <TimeAgo date={user.creationDate} /> : EMPTY_VALUE}
          </span>
        ),
      },
    ];
  }, [user]);

  if (!user) return null;

  return (
    <>
      <ViewPanel
        open={open}
        onClose={onClose}
        title={UC.LABELS.PANELS.VIEW.TITLE}
        icon={icon}
        name={user.fullname}
        description={user.email}
        details={details}
        width={520}
        actions={actions}
      />
      <UserDeleteModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        userName={user.fullname || user.username}
        loading={isDeleting}
      />
    </>
  );
};

export default ViewUserPanel;
