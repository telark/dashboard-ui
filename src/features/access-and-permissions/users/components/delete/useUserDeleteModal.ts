import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { deleteUserThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import store from '../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../auth/store/thunks/fetchThunks';
import type { User } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';
import { rejectionMessage } from '../../../../../utils/helpers/format';

interface UseUserDeleteModalReturn {
  deleteModalOpen: boolean;
  isDeleting: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  handleConfirmDelete: () => Promise<void>;
  userName: string;
}

export const useUserDeleteModal = (user: User | null): UseUserDeleteModalReturn => {
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
    if (!user) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteUserThunk(user.id)).unwrap();
      store.dispatch(fetchMyPermissionsThunk());
      message.success(UC.LABELS.MESSAGES.DELETED(user.fullname || user.username));
      setDeleteModalOpen(false);
    } catch (rejection) {
      message.error(rejectionMessage(rejection, UC.LABELS.MESSAGES.DELETE_FAILED));
    } finally {
      setIsDeleting(false);
    }
  }, [user, dispatch, message]);

  return {
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    userName: user?.fullname || user?.username || '',
  };
};
