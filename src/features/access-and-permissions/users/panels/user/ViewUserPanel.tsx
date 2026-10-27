import React, { useMemo } from 'react';
import { Tag } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  EMPTY_VALUE,
  Icons,
  STATUS_COLORS,
  TAG_CLASS,
  VIEW,
  getPillColor,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
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
import { useUserViewTabs } from '../../hooks/panels/user/useUserViewTabs';
import { noop } from '../../../../../utils/helpers/noop';

interface ViewUserPanelProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onEdit?: () => void;
  canDelete?: boolean;
  /** Opened from another view panel: read-only, and its lists open nothing further. */
  stacked?: boolean;
}

const UserIcon = Icons.User;

const ViewUserPanel: React.FC<ViewUserPanelProps> = ({
  open,
  onClose,
  user,
  onEdit,
  canDelete,
  stacked = false,
}) => {
  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useUserDeleteModal(user);

  const lockReasonFor = useUserLockReason();
  const { tabs, stackedPanel } = useUserViewTabs(user, stacked);

  // Both actions always show; a missing permission or a protected account disables them instead.
  const actions = useMemo(() => {
    const lockReason = user ? lockReasonFor(user) : undefined;
    return {
      editIcon: <UserSwitchOutlined />,
      editLabel: UC.LABELS.ACTIONS.MANAGE_STATE,
      // A disabled action still needs a handler to render; its click is swallowed.
      onEdit: onEdit ?? noop,
      onDelete: openDeleteModal,
      editDisabledReason: onEdit ? lockReason : UC.LABELS.ACTIONS.EDIT_DISABLED_TOOLTIP,
      deleteDisabledReason: canDelete ? lockReason : UC.LABELS.ACTIONS.DELETE_DISABLED_TOOLTIP,
    };
  }, [user, lockReasonFor, onEdit, canDelete, openDeleteModal]);

  const icon = useMemo(() => {
    if (!user) return <UserIcon size={32} style={{ color: DEFAULT_COLORS.SUCCESS }} />;
    return (
      <UserAvatar
        avatar={user.avatar}
        username={user.username}
        size={VIEW.AVATAR_SIZE}
        style={{ border: 'none' }}
      />
    );
  }, [user]);

  const details = useMemo<ViewDetailRow[]>(() => {
    if (!user) return [];

    return [
      {
        label: UC.LABELS.VIEW_LABELS.USERNAME,
        value: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING.SM }}>
            <span
              style={{
                fontSize: FONT_SIZE.BASE,
                fontWeight: FONT_WEIGHT.MEDIUM,
                color: DEFAULT_COLORS.TEXT_ON_SURFACE,
              }}
            >
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
            color={getPillColor(STATUS_COLORS.USER_STATE[user.status.phase])}
            className={TAG_CLASS.MEDIUM}
          >
            {user.status.phase}
          </Tag>
        ),
      },
      {
        label: UC.LABELS.VIEW_LABELS.CREATION_DATE,
        value: (
          <span
            style={{
              fontSize: FONT_SIZE.BASE,
              fontWeight: FONT_WEIGHT.MEDIUM,
              color: DEFAULT_COLORS.TEXT_ON_SURFACE,
            }}
          >
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
        tabs={tabs}
        width={520}
        actions={stacked ? undefined : actions}
      />
      {stackedPanel}
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
