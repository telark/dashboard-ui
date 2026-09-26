import React from 'react';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import { deleteGroupThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import { rejectionMessage } from '../../../../../utils/helpers/format';
import store from '../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../auth/store/thunks/fetchThunks';
import type { Group } from '../../models';

interface UseBulkDeleteGroupsProps {
  selectedGroups: React.Key[];
  groups: Group[] | undefined;
  setSelectedGroups: (keys: React.Key[]) => void;
}

interface UseBulkDeleteGroupsReturn {
  isDeleting: boolean;
  handleBulkDelete: () => Promise<void>;
}

export const useBulkDeleteGroups = ({
  selectedGroups,
  setSelectedGroups,
}: UseBulkDeleteGroupsProps): UseBulkDeleteGroupsReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkDelete = useCallback(async () => {
    const selectedIds = selectedGroups as string[];
    if (selectedIds.length < 2) return;

    setIsDeleting(true);
    const deleteCount = selectedIds.length;
    const loadingKey = `bulk-delete-${Date.now()}`;

    try {
      message.loading({
        content: GC.LABELS.ACTIONS.BULK_DELETE_LOADING(deleteCount),
        key: loadingKey,
        duration: 0,
      });

      const deletePromises = selectedIds.map((id) => dispatch(deleteGroupThunk(id)).unwrap());
      await Promise.all(deletePromises);
      store.dispatch(fetchMyPermissionsThunk());

      message.success({
        content: GC.LABELS.ACTIONS.BULK_DELETE_SUCCESS(deleteCount),
        key: loadingKey,
        duration: 3,
      });

      setSelectedGroups([]);
    } catch (rejection) {
      message.error({
        content: rejectionMessage(rejection, GC.LABELS.ACTIONS.BULK_DELETE_FAILED),
        key: loadingKey,
        duration: 3,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [selectedGroups, dispatch, setSelectedGroups, message]);

  return {
    isDeleting,
    handleBulkDelete,
  };
};
