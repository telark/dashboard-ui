import type React from 'react';
import { createElement, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { FancySpinner } from '../../../../../components/animation';
import { CONTROL_FONT_SIZE } from '../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../constants';
import { deleteRoleThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import { rejectionMessage } from '../../../../../utils/helpers/format';
import store from '../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../auth/store/thunks/fetchThunks';

interface UseBulkDeleteRolesProps {
  selectedRoles: React.Key[];
  setSelectedRoles: (keys: React.Key[]) => void;
}

interface UseBulkDeleteRolesReturn {
  isDeleting: boolean;
  handleBulkDelete: () => Promise<void>;
}

export const useBulkDeleteRoles = ({
  selectedRoles,
  setSelectedRoles,
}: UseBulkDeleteRolesProps): UseBulkDeleteRolesReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkDelete = useCallback(async () => {
    const selectedIds = selectedRoles as string[];
    if (selectedIds.length < 2) return;

    setIsDeleting(true);
    const deleteCount = selectedIds.length;
    const loadingKey = `bulk-delete-roles-${Date.now()}`;

    try {
      message.loading({
        icon: createElement(FancySpinner, { size: CONTROL_FONT_SIZE }),
        content: RC.LABELS.ACTIONS.BULK_DELETE_LOADING(deleteCount),
        key: loadingKey,
        duration: 0,
      });

      await Promise.all(selectedIds.map((id) => dispatch(deleteRoleThunk(id)).unwrap()));
      // A deleted role may have been granting the current user's own permissions.
      store.dispatch(fetchMyPermissionsThunk());

      message.success({
        content: RC.LABELS.ACTIONS.BULK_DELETE_SUCCESS(deleteCount),
        key: loadingKey,
        duration: 3,
      });

      setSelectedRoles([]);
    } catch (rejection) {
      message.error({
        content: rejectionMessage(rejection, RC.LABELS.ACTIONS.BULK_DELETE_FAILED),
        key: loadingKey,
        duration: 3,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [selectedRoles, dispatch, setSelectedRoles, message]);

  return {
    isDeleting,
    handleBulkDelete,
  };
};
