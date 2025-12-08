import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { APP_ROUTES } from '../../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import { createGroupThunk, updateGroupThunk, deleteGroupThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import type { GroupFormData } from '../../models';

export const useGroupMutations = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = useCallback(
    async (data: GroupFormData) => {
      setSubmitting(true);
      try {
        const result = await dispatch(createGroupThunk(data)).unwrap();
        message.success(GC.LABELS.MESSAGES.CREATED(data.name));
        navigate(`${APP_ROUTES.GROUPS}/${result.id}/view`);
        return result;
      } catch {
        message.error(GC.LABELS.MESSAGES.CREATE_FAILED);
        throw new Error(GC.LABELS.MESSAGES.CREATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, navigate],
  );

  const handleUpdate = useCallback(
    async (id: string, data: Partial<GroupFormData>) => {
      setSubmitting(true);
      try {
        const result = await dispatch(
          updateGroupThunk({
            id,
            group: data,
          }),
        ).unwrap();
        message.success(GC.LABELS.MESSAGES.UPDATED(result.name));
        return result;
      } catch {
        message.error(GC.LABELS.MESSAGES.UPDATE_FAILED);
        throw new Error(GC.LABELS.MESSAGES.UPDATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    async (groupId: string) => {
      try {
        await dispatch(deleteGroupThunk(groupId)).unwrap();
        message.success(GC.LABELS.MESSAGES.DELETED);
      } catch {
        message.error(GC.LABELS.MESSAGES.DELETE_FAILED);
        throw new Error(GC.LABELS.MESSAGES.DELETE_FAILED);
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
