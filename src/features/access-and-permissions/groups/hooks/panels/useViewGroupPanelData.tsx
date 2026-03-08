import React, { useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../components/display/table/RowTag';
import { UserDisplay } from '../../../../../components/display/users';
import { useViewGroupPanel } from './useViewGroupPanel';
import { useGroupDeleteModal } from '../../components/delete';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import type { Group } from '../../models';
import type {
  ViewAvatar,
  ViewOverflowItem,
  ViewDetailRow,
} from '../../../../../components/display/panels/view/types';

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
}

export const useViewGroupPanelData = ({
  group,
  onClose,
}: UseViewGroupPanelDataOptions): UseViewGroupPanelDataReturn => {
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
      username: user.username || '',
    }));
  }, [group, groupUsers, avatarSources]);

  const details = useMemo(() => {
    if (!group) return [];
    return [
      {
        label: GC.LABELS.VIEW_LABELS.CATEGORY,
        value: (
          <RowTag
            text={categoryName}
            background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
            color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
            fontSize={12}
          />
        ),
      },
      {
        label: 'Creation Date',
        value: (
          <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
            {group.creationDate ? <TimeAgo date={group.creationDate} /> : '—'}
          </span>
        ),
      },
      {
        label: GC.LABELS.VIEW_LABELS.LAST_UPDATE,
        value: (
          <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
            {group.lastUpdateDate ? <TimeAgo date={group.lastUpdateDate} /> : '—'}
          </span>
        ),
      },
      {
        label: GC.LABELS.VIEW_LABELS.CREATED_BY,
        value: createdByUser ? (
          <UserDisplay user={createdByUser} size="small" showBorder />
        ) : (
          <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>—</span>
        ),
      },
      {
        label: GC.LABELS.VIEW_LABELS.LAST_UPDATED_BY,
        value: lastUpdatedByUser ? (
          <UserDisplay user={lastUpdatedByUser} size="small" showBorder />
        ) : (
          <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>—</span>
        ),
      },
    ];
  }, [group, categoryName, createdByUser, lastUpdatedByUser]);

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
  };
};
