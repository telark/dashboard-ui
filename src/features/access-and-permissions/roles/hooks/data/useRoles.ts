import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../store';
import { fetchAllRolesThunk } from '../../store';
import { ACTION_PERMISSIONS, usePermission } from '../../../../auth/hooks';

const VIEW_ROLES = ACTION_PERMISSIONS.roles.view;

export const useRoles = () => {
  const dispatch: AppDispatch = useDispatch();
  const { roles, loading, loaded, error } = useSelector((state: RootState) => state.roles);
  const canViewRoles = usePermission(VIEW_ROLES.scope, VIEW_ROLES.level);

  useEffect(() => {
    if (canViewRoles) dispatch(fetchAllRolesThunk());
  }, [dispatch, canViewRoles]);

  const refetch = (): void => {
    dispatch(fetchAllRolesThunk());
  };

  return {
    roles,
    loading,
    loaded,
    error,
    refetch,
  };
};
