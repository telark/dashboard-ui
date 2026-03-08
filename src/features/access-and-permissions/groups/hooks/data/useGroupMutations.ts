import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import {
  createGroupThunk,
  updateGroupThunk,
  deleteGroupThunk,
  fetchGroupDetailsThunk,
} from '../../store';
import type { AppDispatch } from '../../../../../store';
import type { GroupFormData } from '../../models';

export const useGroupMutations = () => {
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = useCallback(
    async (data: GroupFormData) => {
      setSubmitting(true);
      try {
        const result = await dispatch(createGroupThunk(data)).unwrap();
        message.success(GC.LABELS.MESSAGES.CREATED(data.name));
        await dispatch(fetchGroupDetailsThunk(result.id));
        return result;
      } catch {
        message.error(GC.LABELS.MESSAGES.CREATE_FAILED);
        throw new Error(GC.LABELS.MESSAGES.CREATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch],
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
        await dispatch(fetchGroupDetailsThunk(id));
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
