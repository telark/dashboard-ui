import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store';
import { fetchGroupDetailsThunk } from '../store';

export const useGroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { details, loading, error } = useSelector((state: RootState) => state.groups);

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupDetailsThunk(id));
    }
  }, [dispatch, id]);

  return {
    id,
    group: details,
    loading,
    error,
    notFound: !loading && !details,
  };
};
