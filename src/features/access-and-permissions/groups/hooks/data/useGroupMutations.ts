import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import {
  createGroupThunk,
  updateGroupThunk,
  deleteGroupThunk,
  fetchGroupDetailsThunk,
} from '../../store';
import type { AppDispatch } from '../../../../../store';
import type { GroupFormData } from '../../models';
import { rejectionMessage } from '../../../../../utils/helpers/format';
import store from '../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../auth/store/thunks/fetchThunks';

// A function payload is resolved just before the PATCH, so it can build on fresh server data.
type GroupUpdate = Partial<GroupFormData> | (() => Promise<Partial<GroupFormData>>);

export const useGroupMutations = () => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = useCallback(
    async (data: GroupFormData) => {
      setSubmitting(true);
      try {
        const result = await dispatch(createGroupThunk(data)).unwrap();
        message.success(GC.LABELS.MESSAGES.CREATED(data.name));
        await dispatch(fetchGroupDetailsThunk(result.id));
        return result;
      } catch (rejection) {
        message.error(rejectionMessage(rejection, GC.LABELS.MESSAGES.CREATE_FAILED));
        throw new Error(GC.LABELS.MESSAGES.CREATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, message],
  );

  const handleUpdate = useCallback(
    async (id: string, data: GroupUpdate) => {
      setSubmitting(true);
      try {
        const result = await dispatch(
          updateGroupThunk({
            id,
            group: typeof data === 'function' ? await data() : data,
          }),
        ).unwrap();
        message.success(GC.LABELS.MESSAGES.UPDATED(result.name));
        await dispatch(fetchGroupDetailsThunk(id));
        return result;
      } catch (rejection) {
        message.error(rejectionMessage(rejection, GC.LABELS.MESSAGES.UPDATE_FAILED));
        throw new Error(GC.LABELS.MESSAGES.UPDATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, message],
  );

  const handleDelete = useCallback(
    async (groupId: string) => {
      try {
        await dispatch(deleteGroupThunk(groupId)).unwrap();
        store.dispatch(fetchMyPermissionsThunk());
        message.success(GC.LABELS.MESSAGES.DELETED);
      } catch (rejection) {
        message.error(rejectionMessage(rejection, GC.LABELS.MESSAGES.DELETE_FAILED));
        throw new Error(GC.LABELS.MESSAGES.DELETE_FAILED);
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
