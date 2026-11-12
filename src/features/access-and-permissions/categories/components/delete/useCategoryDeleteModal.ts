import React from 'react';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { deleteCategory } from '../../clients';
import { fetchCategoriesByScopeThunk } from '../../store';
import { labelsFor } from '../../constants';
import { HTTP_STATUS } from '../../../../../constants';
import type { ExtendedAxiosError } from '../../../../../api/client/normalize';
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
    } catch (error) {
      const { normalized } = error as ExtendedAxiosError;
      // A 409 says how many items still use the category, which the generic text can't.
      message.error(
        normalized?.status === HTTP_STATUS.CONFLICT
          ? normalized.message
          : labelsFor(category.scope).MESSAGES.DELETE_FAILED,
      );
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
