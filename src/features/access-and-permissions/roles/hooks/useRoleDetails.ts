import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store';
import { fetchRoleDetailsThunk } from '../store';

export const useRoleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { details, loading, error } = useSelector((state: RootState) => state.roles);

  useEffect(() => {
    if (id) {
      dispatch(fetchRoleDetailsThunk(id));
    }
  }, [dispatch, id]);

  return {
    id,
    role: details,
    loading,
    error,
    notFound: !loading && !details,
  };
};
