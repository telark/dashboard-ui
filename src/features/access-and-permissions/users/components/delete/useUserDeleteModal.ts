import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { deleteUserThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import store from '../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../auth/store/thunks/fetchThunks';
import type { User } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';

interface UseUserDeleteModalReturn {
  deleteModalOpen: boolean;
  isDeleting: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: (e?: React.MouseEvent) => void;
  handleConfirmDelete: () => Promise<void>;
  userName: string;
}

export const useUserDeleteModal = (user: User | null): UseUserDeleteModalReturn => {
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
    if (!user) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteUserThunk(user.id)).unwrap();
      store.dispatch(fetchMyPermissionsThunk());
      message.success(UC.LABELS.MESSAGES.DELETED(user.fullname || user.username));
      setDeleteModalOpen(false);
    } catch {
      message.error(UC.LABELS.MESSAGES.DELETE_FAILED);
    } finally {
      setIsDeleting(false);
    }
  }, [user, dispatch]);

  return {
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    userName: user?.fullname || user?.username || '',
  };
};
