import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { deleteCategory } from '../../clients';
import { fetchCategoriesByScopeThunk } from '../../store';
import { CATEGORIES_CONSTANTS as CC } from '../../constants';
import type { Category } from '../../models';
import type { AppDispatch } from '../../../../../store';

interface UseCategoryDeleteModalReturn {
  deleteModalOpen: boolean;
  isDeleting: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: (e?: React.MouseEvent) => void;
  handleConfirmDelete: () => Promise<void>;
  categoryName: string;
}

export const useCategoryDeleteModal = (
  category: Category | null,
): UseCategoryDeleteModalReturn => {
  const dispatch: AppDispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = useCallback(() => {
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setDeleteModalOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!category) return;
    setIsDeleting(true);
    try {
      await deleteCategory(category.id);
      message.success(CC.LABELS.MESSAGES.DELETED);
      setDeleteModalOpen(false);
      await dispatch(fetchCategoriesByScopeThunk(category.scope));
    } catch {
      message.error(CC.LABELS.MESSAGES.DELETE_FAILED);
    } finally {
      setIsDeleting(false);
    }
  }, [category, dispatch]);

  return {
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    categoryName: category?.name ?? '',
  };
};
