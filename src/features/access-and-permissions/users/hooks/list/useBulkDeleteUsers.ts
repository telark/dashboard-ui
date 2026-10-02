import type React from 'react';
import { createElement, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { FancySpinner } from '../../../../../components/animation';
import { CONTROL_FONT_SIZE } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import { deleteUserThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import { rejectionMessage } from '../../../../../utils/helpers/format';
import store from '../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../auth/store/thunks/fetchThunks';

interface UseBulkDeleteUsersProps {
  selectedUsers: React.Key[];
  setSelectedUsers: (keys: React.Key[]) => void;
}

interface UseBulkDeleteUsersReturn {
  isDeleting: boolean;
  handleBulkDelete: () => Promise<void>;
}

export const useBulkDeleteUsers = ({
  selectedUsers,
  setSelectedUsers,
}: UseBulkDeleteUsersProps): UseBulkDeleteUsersReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkDelete = useCallback(async () => {
    const selectedIds = selectedUsers as string[];
    if (selectedIds.length < 2) return;

    setIsDeleting(true);
    const deleteCount = selectedIds.length;
    const loadingKey = `bulk-delete-users-${Date.now()}`;

    try {
      message.loading({
        icon: createElement(FancySpinner, { size: CONTROL_FONT_SIZE }),
        content: UC.LABELS.ACTIONS.BULK_DELETE_LOADING(deleteCount),
        key: loadingKey,
        duration: 0,
      });

      const deletePromises = selectedIds.map((id) => dispatch(deleteUserThunk(id)).unwrap());
      await Promise.all(deletePromises);
      store.dispatch(fetchMyPermissionsThunk());

      message.success({
        content: UC.LABELS.ACTIONS.BULK_DELETE_SUCCESS(deleteCount),
        key: loadingKey,
        duration: 3,
      });

      setSelectedUsers([]);
    } catch (rejection) {
      message.error({
        content: rejectionMessage(rejection, UC.LABELS.ACTIONS.BULK_DELETE_FAILED),
        key: loadingKey,
        duration: 3,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [selectedUsers, dispatch, setSelectedUsers, message]);

  return {
    isDeleting,
    handleBulkDelete,
  };
};
