import React, { useState, useCallback } from 'react';
import { useGroupMutations } from '../../hooks';
import type { Group } from '../../models';
import { GROUPS_CONSTANTS as GC } from '../../constants';

interface UseGroupDeleteModalReturn {
  deleteModalOpen: boolean;
  isDeleting: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  handleConfirmDelete: () => Promise<void>;
  groupName: string;
  deleteImpact?: string;
}

const groupDeleteImpact = (group: Group | null): string | undefined => {
  const members = new Set(group?.assignedUsersIDs ?? []).size;
  const roles = new Set(group?.assignedRolesIDs ?? []).size;
  return members + roles > 0 ? GC.LABELS.ACTIONS.DELETE_IMPACT(members, roles) : undefined;
};

export const useGroupDeleteModal = (group: Group | null): UseGroupDeleteModalReturn => {
  const { handleDelete } = useGroupMutations();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = useCallback(() => {
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setDeleteModalOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!group) return;
    setIsDeleting(true);
    try {
      await handleDelete(group.id);
      setDeleteModalOpen(false);
    } catch {
      // Error message already shown by handleDelete
    } finally {
      setIsDeleting(false);
    }
  }, [group, handleDelete]);

  return {
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    groupName: group?.name || '',
    deleteImpact: groupDeleteImpact(group),
  };
};
