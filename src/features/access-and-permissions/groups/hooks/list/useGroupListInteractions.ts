import React from 'react';
import { useCallback } from 'react';
import type { Group } from '../../models';

interface UseGroupListInteractionsProps {
  selectedGroups: React.Key[];
  groups: Group[] | undefined;
  onEdit?: (group: Group) => void;
  onView?: (group: Group) => void;
}

interface UseGroupListInteractionsReturn {
  handleView: () => void;
  handleEdit: () => void;
  handleViewGroup: (record: Group) => void;
  handleEditGroup: (record: Group) => void;
}

export const useGroupListInteractions = ({
  selectedGroups,
  groups,
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
    handleViewGroup,
    handleEditGroup,
  };
};
