import React, { useMemo } from 'react';
import { DEFAULT_COLORS, EMPTY_VALUE } from '../../../../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../../components/display/table/RowTag';
import { ActorDisplay } from '../../../../../../components/display/users';
import { useViewGroupPanel } from './useViewGroupPanel';
import { useGroupDeleteModal } from '../../../components/delete';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import type { Group } from '../../../models';
import type {
  ViewAvatar,
  ViewOverflowItem,
  ViewDetailRow,
} from '../../../../../../components/display/panels/view/types';

interface UseViewGroupPanelDataOptions {
  group: Group | null;
  onClose: () => void;
}

interface UseViewGroupPanelDataReturn {
  avatars: ViewAvatar[];
  overflowItems: ViewOverflowItem[];
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
  const {
    groupUsers,
    categoryName,
    createdByUser,
    lastUpdatedByUser,
    usernamesById,
    avatarSources,
  } = useViewGroupPanel(group);
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

  const avatars = useMemo(() => {
    if (!group) return [];
    return groupUsers.map((user) => ({
      key: user.id,
      src: avatarSources[user.id],
      fallback: user.username ? user.username.charAt(0).toUpperCase() : undefined,
      tooltip: user.username || '',
    }));
  }, [group, groupUsers, avatarSources]);

  const overflowItems = useMemo(() => {
    if (!group) return [];
    return groupUsers.slice(5).map((user) => ({
      key: user.id,
      src: avatarSources[user.id],
      fallback: user.username ? user.username.charAt(0).toUpperCase() : undefined,
      username: user.username || '',
    }));
  }, [group, groupUsers, avatarSources]);

  const details = useMemo(() => {
    if (!group) return [];
    return [
      {
        label: GC.LABELS.VIEW_LABELS.CATEGORY,
        value: <RowTag text={categoryName} fontSize={12} />,
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
    avatars,
    overflowItems,
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
