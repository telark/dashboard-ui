import React from 'react';
import { ROLES_CONSTANTS as RPC } from '../../../roles/constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../components/display/table/RowTag';
import { UserDisplay } from '../../../../../components/display/users';
import { Icons } from '../../../../../constants';
import ViewPanel from '../../../../../components/display/panels/view/ViewPanel';
import { useViewGroupPanel } from '../../hooks';
import { useGroupDeleteModal, GroupDeleteModal } from '../../components/delete';
import type { Group } from '../../models';

const GroupIcon = Icons.Group;

interface ViewGroupPanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  onEdit?: () => void;
}

const ViewGroupPanel: React.FC<ViewGroupPanelProps> = ({ open, onClose, group, onEdit }) => {
  const { groupUsers, categoryName, createdByUser, lastUpdatedByUser, avatarSources } =
    useViewGroupPanel(group);
  const {
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete: baseHandleConfirmDelete,
  } = useGroupDeleteModal(group);

  const handleConfirmDelete = async () => {
    await baseHandleConfirmDelete();
    // Close the view panel after successful delete
    onClose();
  };

  if (!group) return null;

  const avatars = groupUsers.map((user) => ({
    key: user.id,
    src: avatarSources[user.id],
    fallback: user.username ? user.username.charAt(0).toUpperCase() : undefined,
    tooltip: user.username,
  }));

  const overflowItems = groupUsers.slice(5).map((user) => ({
    key: user.id,
    src: avatarSources[user.id],
    username: user.username,
  }));

  const details = [
    {
      label: 'Category',
      value: (
        <RowTag
          text={categoryName}
          background={RPC.COLORS.TYPE_CUSTOM_BG}
          color={RPC.COLORS.TYPE_CUSTOM_TEXT}
          fontSize={12}
        />
      ),
    },
    {
      label: 'Creation Date',
      value: (
        <span style={{ fontSize: 14, fontWeight: 500, color: '#0B1F33' }}>
          {group.creationDate ? <TimeAgo date={group.creationDate} /> : '—'}
        </span>
      ),
    },
    {
      label: 'Last Update',
      value: (
        <span style={{ fontSize: 14, fontWeight: 500, color: '#0B1F33' }}>
          {group.lastUpdateDate ? <TimeAgo date={group.lastUpdateDate} /> : '—'}
        </span>
      ),
    },
    {
      label: 'Created By',
      value: createdByUser ? (
        <UserDisplay user={createdByUser} size="small" showBorder />
      ) : (
        <span style={{ color: '#64748b' }}>—</span>
      ),
    },
    {
      label: 'Last Updated By',
      value: lastUpdatedByUser ? (
        <UserDisplay user={lastUpdatedByUser} size="small" showBorder />
      ) : (
        <span style={{ color: '#64748b' }}>—</span>
      ),
    },
  ];

  return (
    <>
      <ViewPanel
        open={open}
        onClose={onClose}
        title="Group Details"
        icon={<GroupIcon size={32} style={{ color: '#20C997' }} />}
        name={group.name}
        description={group.description}
        avatars={avatars}
        overflowItems={overflowItems}
        details={details}
        width={520}
        actions={{
          onEdit,
          onDelete: openDeleteModal,
        }}
      />
      <GroupDeleteModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        groupName={group.name}
        loading={isDeleting}
      />
    </>
  );
};

export default ViewGroupPanel;
