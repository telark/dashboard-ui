import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { APP_ROUTES } from '../../../../constants';
import { ROLES_CONSTANTS as RC } from '../constants';
import { createRoleThunk, updateRoleThunk, deleteRoleThunk } from '../store';
import type { AppDispatch } from '../../../../store';
import type { RoleFormData } from '../models';

export const useRoleActions = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = useCallback(
    async (data: RoleFormData) => {
      setSubmitting(true);
      try {
        const result = await dispatch(createRoleThunk(data)).unwrap();
        message.success(RC.LABELS.MESSAGES.CREATED(data.name));
        navigate(`${APP_ROUTES.ROLES}/${result.id}/view`);
        return result;
      } catch {
        message.error(RC.LABELS.MESSAGES.CREATE_FAILED || 'Failed to create role');
        throw new Error(RC.LABELS.MESSAGES.CREATE_FAILED || 'Failed to create role');
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, navigate],
  );

  const handleUpdate = useCallback(
    async (id: string, data: Partial<RoleFormData>) => {
      setSubmitting(true);
      try {
        const result = await dispatch(
          updateRoleThunk({
            id,
            role: data,
          }),
        ).unwrap();
        message.success(RC.LABELS.MESSAGES.UPDATED(result.name));
        navigate(`${APP_ROUTES.ROLES}/${id}/view`);
      } catch {
        message.error(RC.LABELS.MESSAGES.UPDATE_FAILED || 'Failed to update role');
        throw new Error(RC.LABELS.MESSAGES.UPDATE_FAILED || 'Failed to update role');
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, navigate],
  );

  const handleDelete = useCallback(
    async (roleId: string) => {
      try {
        await dispatch(deleteRoleThunk(roleId)).unwrap();
        message.success(RC.LABELS.MESSAGES.DELETED || 'Role deleted successfully');
      } catch {
        message.error(RC.LABELS.MESSAGES.DELETE_FAILED || 'Failed to delete role');
        throw new Error(RC.LABELS.MESSAGES.DELETE_FAILED || 'Failed to delete role');
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
