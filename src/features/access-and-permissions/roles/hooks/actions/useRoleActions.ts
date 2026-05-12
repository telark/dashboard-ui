import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { APP_ROUTES } from '../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../constants';
import { createRoleThunk, updateRoleThunk, deleteRoleThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import store from '../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../auth/store/thunks/fetchThunks';
import type { RoleFormData } from '../../models';

export interface UseRoleActionsOptions {
  /** When true, create/update do not navigate (e.g. when using panels on list page). */
  skipNavigate?: boolean;
}

export const useRoleActions = (options?: UseRoleActionsOptions) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const skipNavigate = Boolean(options?.skipNavigate);

  const handleCreate = useCallback(
    async (data: RoleFormData) => {
      setSubmitting(true);
      try {
        const result = await dispatch(createRoleThunk(data)).unwrap();
        message.success(RC.LABELS.MESSAGES.CREATED(data.name));
        if (!skipNavigate) {
          navigate(APP_ROUTES.ROLES);
        }
        return result;
      } catch {
        message.error(RC.LABELS.MESSAGES.CREATE_FAILED);
        throw new Error(RC.LABELS.MESSAGES.CREATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, navigate, skipNavigate],
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
          if (!skipNavigate) {
            navigate(`${APP_ROUTES.ROLES}/${id}/view`);
          }
        }
        return result;
      } catch (error) {
        if (!options?.silent) {
          message.error(RC.LABELS.MESSAGES.UPDATE_FAILED);
        }
        throw error instanceof Error ? error : new Error(RC.LABELS.MESSAGES.UPDATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, navigate, skipNavigate],
  );

  const handleDelete = useCallback(
    async (roleId: string) => {
      try {
        await dispatch(deleteRoleThunk(roleId)).unwrap();
        store.dispatch(fetchMyPermissionsThunk());
        message.success(RC.LABELS.MESSAGES.DELETED);
      } catch {
        message.error(RC.LABELS.MESSAGES.DELETE_FAILED);
        throw new Error(RC.LABELS.MESSAGES.DELETE_FAILED);
      }
    },
    [dispatch],
  );

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    submitting,
  };
};
