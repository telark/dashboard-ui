import React, { useMemo } from 'react';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import ViewPanel from '../../../../../components/display/panels/view/ViewPanel';
import RowTag from '../../../../../components/display/table/RowTag';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import UserAvatar from '../../../../../components/display/avatars/UserAvatar';
import { useUserDeleteModal, UserDeleteModal } from '../../components/delete';
import type { ViewDetailRow } from '../../../../../components/display/panels/view/types';
import type { User } from '../../models';

interface ViewUserPanelProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onEdit?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

const UserIcon = Icons.User;

const ViewUserPanel: React.FC<ViewUserPanelProps> = ({ open, onClose, user, onEdit, onDelete, canDelete }) => {
  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useUserDeleteModal(user);

  const handleDeleteAction = useMemo(
    () => (canDelete ? (onDelete ?? openDeleteModal) : undefined),
    [canDelete, onDelete, openDeleteModal],
  );

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
          <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
            {user.username}
          </span>
        ),
      },
      {
        label: UC.LABELS.VIEW_LABELS.STATUS,
        value: (
          <RowTag
            text={user.status.phase}
            background={isActive ? `${DEFAULT_COLORS.SUCCESS}18` : DEFAULT_COLORS.CHIP_CUSTOM_BG}
            color={isActive ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
            fontSize={12}
          />
        ),
      },
      {
        label: UC.LABELS.VIEW_LABELS.CREATION_DATE,
        value: (
          <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
            {user.creationDate ? <TimeAgo date={user.creationDate} /> : '—'}
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
        actions={{ onEdit, onDelete: handleDeleteAction }}
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
