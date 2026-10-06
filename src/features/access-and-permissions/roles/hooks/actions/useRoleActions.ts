import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { ROLES_CONSTANTS as RC } from '../../constants';
import { createRoleThunk, updateRoleThunk, deleteRoleThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import store from '../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../auth/store/thunks/fetchThunks';
import type { RoleFormData } from '../../models';
import { rejectionMessage } from '../../../../../utils/helpers/format';

export const useRoleActions = () => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = useCallback(
    async (data: RoleFormData) => {
      setSubmitting(true);
      try {
        const result = await dispatch(createRoleThunk(data)).unwrap();
        message.success(RC.LABELS.MESSAGES.CREATED(data.name));
        return result;
      } catch (rejection) {
        message.error(rejectionMessage(rejection, RC.LABELS.MESSAGES.CREATE_FAILED));
        throw new Error(RC.LABELS.MESSAGES.CREATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, message],
  );

  const handleUpdate = useCallback(
    async (id: string, data: Partial<RoleFormData>, options?: { silent?: boolean }) => {
      setSubmitting(true);
      try {
        const result = await dispatch(
          updateRoleThunk({
            id,
            role: data,
          }),
        ).unwrap();
        store.dispatch(fetchMyPermissionsThunk());
        if (!options?.silent) {
          message.success(RC.LABELS.MESSAGES.UPDATED(result.name));
        }
        return result;
      } catch (error) {
        const reason = rejectionMessage(error, RC.LABELS.MESSAGES.UPDATE_FAILED);
        if (!options?.silent) {
          message.error(reason);
        }
        throw error instanceof Error ? error : new Error(reason);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, message],
  );

  const handleDelete = useCallback(
    async (roleId: string) => {
      try {
        await dispatch(deleteRoleThunk(roleId)).unwrap();
        store.dispatch(fetchMyPermissionsThunk());
        message.success(RC.LABELS.MESSAGES.DELETED);
      } catch (rejection) {
        message.error(rejectionMessage(rejection, RC.LABELS.MESSAGES.DELETE_FAILED));
        throw new Error(RC.LABELS.MESSAGES.DELETE_FAILED);
      }
    },
    [dispatch, message],
  );

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    submitting,
  };
};
