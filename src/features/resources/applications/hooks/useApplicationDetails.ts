import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';
import { clearDetails, fetchApplicationDetailsThunk } from '../store';

export function useApplicationDetails(name?: string) {
  const dispatch: AppDispatch = useDispatch();
  const { details, loading, error } = useSelector((s: RootState) => s.applications);

  useEffect(() => {
    if (!name) return;
    void dispatch(fetchApplicationDetailsThunk(name));

    return () => {
      dispatch(clearDetails());
    };
  }, [dispatch, name]);

  const refresh = useCallback(() => {
    if (!name) return;
    void dispatch(fetchApplicationDetailsThunk(name));
  }, [dispatch, name]);

  return { details, loading, error, refresh };
}
