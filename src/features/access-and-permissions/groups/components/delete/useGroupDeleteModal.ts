import React, { useState, useCallback } from 'react';
import { useGroupMutations } from '../../hooks';
import type { Group } from '../../models';

interface UseGroupDeleteModalReturn {
  deleteModalOpen: boolean;
  isDeleting: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  handleConfirmDelete: () => Promise<void>;
  groupName: string;
}

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
  };
};
