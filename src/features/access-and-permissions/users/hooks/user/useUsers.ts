import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../store';
import { fetchAllUsersThunk } from '../../store';
import { ACTION_PERMISSIONS, usePermission } from '../../../../auth/hooks';

const VIEW_USERS = ACTION_PERMISSIONS.users.view;

export const useUsers = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector((state: RootState) => state.users);
  const canViewUsers = usePermission(VIEW_USERS.scope, VIEW_USERS.level);

  useEffect(() => {
    if (canViewUsers) dispatch(fetchAllUsersThunk());
  }, [dispatch, canViewUsers]);

  const refetch = (): void => {
    dispatch(fetchAllUsersThunk());
  };

  return {
    users,
    loading,
    error,
    refetch,
  };
};
