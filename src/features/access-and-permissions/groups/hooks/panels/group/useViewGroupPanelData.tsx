import React, { useMemo } from 'react';
import { Tag } from 'antd';
import { DEFAULT_COLORS, EMPTY_VALUE, TAG_CLASS } from '../../../../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import { ActorDisplay } from '../../../../../../components/display/users';
import { useViewGroupPanel } from './useViewGroupPanel';
import { useGroupDeleteModal } from '../../../components/delete';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import type { Group } from '../../../models';
import type { ViewDetailRow } from '../../../../../../components/display/panels/view/types';

interface UseViewGroupPanelDataOptions {
  group: Group | null;
  onClose: () => void;
}

interface UseViewGroupPanelDataReturn {
  details: ViewDetailRow[];
  deleteModalOpen: boolean;
  isDeleting: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  handleConfirmDelete: () => Promise<void>;
  groupName: string;
  deleteImpact?: string;
}

export const useViewGroupPanelData = ({
  group,
  onClose,
}: UseViewGroupPanelDataOptions): UseViewGroupPanelDataReturn => {
  const { categoryName, createdByUser, lastUpdatedByUser, usernamesById } =
    useViewGroupPanel(group);
  const {
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete: baseHandleConfirmDelete,
    deleteImpact,
  } = useGroupDeleteModal(group);

  const handleConfirmDelete = async () => {
    await baseHandleConfirmDelete();
    onClose();
  };

  const details = useMemo(() => {
    if (!group) return [];
    return [
      {
        label: GC.LABELS.VIEW_LABELS.CATEGORY,
        value: <Tag className={TAG_CLASS.MEDIUM}>{categoryName}</Tag>,
      },
      {
        label: GC.LABELS.VIEW_LABELS.CREATION_DATE,
        value: (
          <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_ON_SURFACE }}>
            {group.creationDate ? <TimeAgo date={group.creationDate} /> : EMPTY_VALUE}
          </span>
        ),
      },
      {
        label: GC.LABELS.VIEW_LABELS.LAST_UPDATE,
        value: (
          <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_ON_SURFACE }}>
            {group.lastUpdateDate ? <TimeAgo date={group.lastUpdateDate} /> : EMPTY_VALUE}
          </span>
        ),
      },
      {
        label: GC.LABELS.VIEW_LABELS.CREATED_BY,
        value: group.createdBy ? (
          <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE }}>
            <ActorDisplay
              actor={group.createdBy}
              user={createdByUser}
              usernamesById={usernamesById}
              size="small"
              showBorder
            />
          </span>
        ) : (
          <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}>{EMPTY_VALUE}</span>
        ),
      },
      {
        label: GC.LABELS.VIEW_LABELS.LAST_UPDATED_BY,
        value: group.lastUpdatedBy ? (
          <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE }}>
            <ActorDisplay
              actor={group.lastUpdatedBy}
              user={lastUpdatedByUser}
              usernamesById={usernamesById}
              size="small"
              showBorder
            />
          </span>
        ) : (
          <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}>{EMPTY_VALUE}</span>
        ),
      },
    ];
  }, [group, categoryName, createdByUser, lastUpdatedByUser, usernamesById]);

  return {
    details,
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    groupName: group?.name || '',
    deleteImpact,
  };
};
