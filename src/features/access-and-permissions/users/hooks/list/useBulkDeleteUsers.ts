import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { USERS_CONSTANTS as UC } from '../../constants';
import { deleteUserThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';

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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkDelete = useCallback(async () => {
    const selectedIds = selectedUsers as string[];
    if (selectedIds.length < 2) return;

    setIsDeleting(true);
    const deleteCount = selectedIds.length;
    const loadingKey = `bulk-delete-users-${Date.now()}`;

    try {
      message.loading({
        content: UC.LABELS.ACTIONS.BULK_DELETE_LOADING(deleteCount),
        key: loadingKey,
        duration: 0,
      });

      const deletePromises = selectedIds.map((id) =>
        dispatch(deleteUserThunk(id)).unwrap(),
      );
      await Promise.all(deletePromises);

      message.success({
        content: UC.LABELS.ACTIONS.BULK_DELETE_SUCCESS(deleteCount),
        key: loadingKey,
        duration: 3,
      });

      setSelectedUsers([]);
    } catch {
      message.error({
        content: UC.LABELS.ACTIONS.BULK_DELETE_FAILED,
        key: loadingKey,
        duration: 3,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [selectedUsers, dispatch, setSelectedUsers]);

  return {
    isDeleting,
    handleBulkDelete,
  };
};
