import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../store';
import { fetchAllRolesThunk } from '../../store';

export const useRoles = () => {
  const dispatch: AppDispatch = useDispatch();
  const { roles, loading, error } = useSelector((state: RootState) => state.roles);

  useEffect(() => {
    dispatch(fetchAllRolesThunk());
  }, [dispatch]);

  return {
    roles,
    loading,
    error,
  };
};
