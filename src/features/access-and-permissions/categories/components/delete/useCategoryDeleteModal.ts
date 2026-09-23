import React from 'react';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { deleteCategory } from '../../clients';
import { fetchCategoriesByScopeThunk } from '../../store';
import { labelsFor } from '../../constants';
import type { Category } from '../../models';
import type { AppDispatch } from '../../../../../store';

interface UseCategoryDeleteModalReturn {
  deleteModalOpen: boolean;
  isDeleting: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  handleConfirmDelete: () => Promise<void>;
  categoryName: string;
}

export const useCategoryDeleteModal = (category: Category | null): UseCategoryDeleteModalReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
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
    if (!category) return;
    setIsDeleting(true);
    try {
      await deleteCategory(category.id);
      message.success(labelsFor(category.scope).MESSAGES.DELETED);
      setDeleteModalOpen(false);
      await dispatch(fetchCategoriesByScopeThunk(category.scope));
    } catch {
      message.error(labelsFor(category.scope).MESSAGES.DELETE_FAILED);
    } finally {
      setIsDeleting(false);
    }
  }, [category, dispatch, message]);

  return {
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    categoryName: category?.name ?? '',
  };
};
