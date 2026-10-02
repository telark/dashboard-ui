import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../store';
import { fetchAllGroupsThunk } from '../../store';
import { ACTION_PERMISSIONS, usePermission } from '../../../../auth/hooks';

const VIEW_GROUPS = ACTION_PERMISSIONS.groups.view;

export const useFetchGroups = () => {
  const dispatch: AppDispatch = useDispatch();
  const { groups, loading, loaded, error } = useSelector((state: RootState) => state.groups);
  const canViewGroups = usePermission(VIEW_GROUPS.scope, VIEW_GROUPS.level);

  useEffect(() => {
    if (canViewGroups) dispatch(fetchAllGroupsThunk());
  }, [dispatch, canViewGroups]);

  const refetch = (): void => {
    dispatch(fetchAllGroupsThunk());
  };

  return {
    groups,
    loading,
    loaded,
    error,
    refetch,
  };
};
