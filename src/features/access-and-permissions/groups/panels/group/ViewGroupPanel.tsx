import React, { useState } from 'react';
import {
  Icons,
  DEFAULT_COLORS,
  FONT_WEIGHT,
  SLIDE_OUT,
  UNSTYLED_BUTTON,
  VIEW,
} from '../../../../../constants';
import ViewPanel from '../../../../../components/display/panels/view/ViewPanel';
import { useViewGroupPanelData } from '../../hooks';
import { useGroupViewTabs } from '../../hooks/panels/group/useGroupViewTabs';
import { GroupDeleteModal } from '../../components/delete';
import type { Group } from '../../models';
import { GROUPS_CONSTANTS as GC } from '../../constants';

const GroupIcon = Icons.Group;
const { DESCRIPTION_PREVIEW_CHARS, SHOW_MORE, SHOW_LESS } = GC.LABELS.PANELS.VIEW;

const SHOW_MORE_STYLE: React.CSSProperties = {
  ...UNSTYLED_BUTTON,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE,
  fontWeight: FONT_WEIGHT.MEDIUM,
};

// Array.from counts by character, so the cut never splits an emoji.
const GroupDescription: React.FC<{ text: string }> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const chars = Array.from(text);
  if (chars.length <= DESCRIPTION_PREVIEW_CHARS) return text;
  return (
    <>
      {expanded ? text : `${chars.slice(0, DESCRIPTION_PREVIEW_CHARS).join('').trimEnd()}…`}{' '}
      <button
        type="button"
        aria-expanded={expanded}
        className={SLIDE_OUT.HEADER_BUTTON_CLASS}
        style={SHOW_MORE_STYLE}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? SHOW_LESS : SHOW_MORE}
      </button>
    </>
  );
};

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
        description={group.description ? <GroupDescription text={group.description} /> : undefined}
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
