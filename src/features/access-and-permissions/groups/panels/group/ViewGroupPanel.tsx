import React from 'react';
import { Icons, DEFAULT_COLORS, VIEW } from '../../../../../constants';
import ViewPanel from '../../../../../components/display/panels/view/ViewPanel';
import { useViewGroupPanelData } from '../../hooks';
import { useGroupViewTabs } from '../../hooks/panels/group/useGroupViewTabs';
import { GroupDeleteModal } from '../../components/delete';
import type { Group } from '../../models';
import { GROUPS_CONSTANTS as GC } from '../../constants';

const GroupIcon = Icons.Group;

interface ViewGroupPanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  onEdit?: () => void;
  canDelete?: boolean;
  /** Opened from another view panel: its lists open nothing further. */
  stacked?: boolean;
}

const ViewGroupPanel: React.FC<ViewGroupPanelProps> = ({
  open,
  onClose,
  group,
  onEdit,
  canDelete,
  stacked = false,
}) => {
  const {
    details,
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    groupName,
    deleteImpact,
  } = useViewGroupPanelData({
    group,
    onClose,
  });
  const { tabs, stackedPanel } = useGroupViewTabs(group, stacked);

  if (!group) return null;

  return (
    <>
      <ViewPanel
        open={open}
        onClose={onClose}
        title={GC.LABELS.PANELS.VIEW.TITLE}
        icon={<GroupIcon size={VIEW.GROUP_ICON_SIZE} style={{ color: DEFAULT_COLORS.SUCCESS }} />}
        name={group.name}
        description={group.description}
        details={details}
        tabs={tabs}
        width={520}
        actions={{
          onEdit,
          onDelete: canDelete ? openDeleteModal : undefined,
        }}
      />
      {stackedPanel}
      <GroupDeleteModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        groupName={groupName}
        loading={isDeleting}
        impact={deleteImpact}
      />
    </>
  );
};

export default ViewGroupPanel;
