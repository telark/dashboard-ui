import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { APP_ROUTES } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import { createUserThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import store from '../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../auth/store/thunks/fetchThunks';
import type { CreateUserFormValues } from '../../models';

export const useUserActions = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = useCallback(
    async (data: CreateUserFormValues) => {
      setSubmitting(true);
      try {
        const result = await dispatch(createUserThunk(data)).unwrap();
        store.dispatch(fetchMyPermissionsThunk());
        message.success(UC.LABELS.MESSAGES.CREATED(data.fullname));
        navigate(`${APP_ROUTES.USERS}/${result.id}/view`);
        return result;
      } catch {
        message.error(UC.LABELS.MESSAGES.CREATE_FAILED);
        throw new Error(UC.LABELS.MESSAGES.CREATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, navigate, message],
  );

  return {
    handleCreate,
    submitting,
  };
};
