import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../store';
import { fetchAllGroupsThunk } from '../../store';

export const useGroups = () => {
  const dispatch: AppDispatch = useDispatch();
  const { groups, loading, error } = useSelector((state: RootState) => state.groups);

  useEffect(() => {
    dispatch(fetchAllGroupsThunk());
  }, [dispatch]);

  return {
    groups,
    loading,
    error,
  };
};
