import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store';
import { fetchAllUsersThunk } from '../store';

export const useUsers = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  return {
    users,
    loading,
    error,
  };
};
