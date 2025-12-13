import React from 'react';
import { Icons, DEFAULT_COLORS } from '../../../../../constants';
import ViewPanel from '../../../../../components/display/panels/view/ViewPanel';
import { useViewGroupPanelData } from '../../hooks';
import { GroupDeleteModal } from '../../components/delete';
import type { Group } from '../../models';

const GroupIcon = Icons.Group;

interface ViewGroupPanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  onEdit?: () => void;
}

const ViewGroupPanel: React.FC<ViewGroupPanelProps> = ({ open, onClose, group, onEdit }) => {
  const {
    avatars,
    overflowItems,
    details,
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    groupName,
  } = useViewGroupPanelData({
    group,
    onClose,
  });

  if (!group) return null;

  return (
    <>
      <ViewPanel
        open={open}
        onClose={onClose}
        title="Group Details"
        icon={<GroupIcon size={32} style={{ color: DEFAULT_COLORS.SUCCESS }} />}
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
        groupName={groupName}
        loading={isDeleting}
      />
    </>
  );
};

export default ViewGroupPanel;
