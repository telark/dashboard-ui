import React from 'react';
import { useCallback } from 'react';
import { Modal } from 'antd';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import type { Group } from '../../models';

interface UseGroupListInteractionsProps {
  selectedGroups: React.Key[];
  groups: Group[] | undefined;
  handleDelete: (id: string) => Promise<void>;
  setSelectedGroups: (keys: React.Key[]) => void;
  onEdit?: (group: Group) => void;
  onView?: (group: Group) => void;
}

interface UseGroupListInteractionsReturn {
  handleView: () => void;
  handleEdit: () => void;
  handleDeleteClick: () => void;
  handleViewGroup: (record: Group) => void;
  handleEditGroup: (record: Group) => void;
}

export const useGroupListInteractions = ({
  selectedGroups,
  groups,
  handleDelete,
  setSelectedGroups,
  onEdit,
  onView,
}: UseGroupListInteractionsProps): UseGroupListInteractionsReturn => {
  const selectedCount = selectedGroups.length;

  const handleView = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = groups?.find((g) => g.id === selectedId);
      if (selectedGroup && onView) {
        onView(selectedGroup);
      }
    }
  }, [selectedCount, selectedGroups, groups, onView]);

  const handleEdit = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = groups?.find((g) => g.id === selectedId);
      if (selectedGroup && onEdit) {
        onEdit(selectedGroup);
      }
    }
  }, [selectedCount, selectedGroups, groups, onEdit]);

  const handleDeleteClick = useCallback(() => {
    const selectedIds = selectedGroups as string[];
    if (selectedIds.length === 0) return;

    const selectedGroupNames = selectedIds
      .map((id) => groups?.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[];

    Modal.confirm({
      title: GC.LABELS.ACTIONS.DELETE_MODAL_TITLE,
      content: GC.LABELS.ACTIONS.DELETE_MODAL_CONTENT(
        selectedGroupNames.length === 1
          ? selectedGroupNames[0]
          : `${selectedGroupNames.length} groups`,
      ),
      okText: GC.LABELS.ACTIONS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: async () => {
        for (const id of selectedIds) {
          const group = groups?.find((g) => g.id === id);
          if (group) {
            try {
              await handleDelete(id);
            } catch {
              // Error message already shown by handleDelete
            }
          }
        }
        setSelectedGroups([]);
      },
    });
  }, [selectedGroups, groups, handleDelete, setSelectedGroups]);

  const handleViewGroup = useCallback(
    (record: Group) => {
      if (onView) {
        onView(record);
      }
    },
    [onView],
  );

  const handleEditGroup = useCallback(
    (record: Group) => {
      if (onEdit) {
        onEdit(record);
      }
    },
    [onEdit],
  );

  return {
    handleView,
    handleEdit,
    handleDeleteClick,
    handleViewGroup,
    handleEditGroup,
  };
};
