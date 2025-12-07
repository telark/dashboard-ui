import React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { APP_ROUTES } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import type { Group } from '../models';

interface UseGroupListActionsProps {
  selectedGroups: React.Key[];
  groups: Group[] | undefined;
  handleDelete: (id: string) => Promise<void>;
  setSelectedGroups: (keys: React.Key[]) => void;
}

interface UseGroupListActionsReturn {
  handleView: () => void;
  handleEdit: () => void;
  handleDeleteClick: () => void;
  handleViewGroup: (record: Group) => void;
  handleEditGroup: (record: Group) => void;
}

export const useGroupListActions = ({
  selectedGroups,
  groups,
  handleDelete,
  setSelectedGroups,
}: UseGroupListActionsProps): UseGroupListActionsReturn => {
  const navigate = useNavigate();
  const selectedCount = selectedGroups.length;

  const handleView = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = groups?.find((g) => g.id === selectedId);
      if (selectedGroup) {
        navigate(`${APP_ROUTES.GROUPS}/${selectedGroup.id}/view`);
      }
    }
  }, [selectedCount, selectedGroups, groups, navigate]);

  const handleEdit = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = groups?.find((g) => g.id === selectedId);
      if (selectedGroup) {
        navigate(`${APP_ROUTES.GROUPS}/${selectedGroup.id}/edit`);
      }
    }
  }, [selectedCount, selectedGroups, groups, navigate]);

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
      navigate(`${APP_ROUTES.GROUPS}/${record.id}/view`);
    },
    [navigate],
  );

  const handleEditGroup = useCallback(
    (record: Group) => {
      navigate(`${APP_ROUTES.GROUPS}/${record.id}/edit`);
    },
    [navigate],
  );

  return {
    handleView,
    handleEdit,
    handleDeleteClick,
    handleViewGroup,
    handleEditGroup,
  };
};
