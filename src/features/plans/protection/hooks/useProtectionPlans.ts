import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../../store';
import {
  fetchProtectionPlansThunk,
  selectProtectionPlans,
  selectProtectionPlansLoading,
  selectProtectionPlansError,
} from '../store';

export const useProtectionPlans = () => {
  const dispatch: AppDispatch = useDispatch();
  const plans = useSelector(selectProtectionPlans);
  const loading = useSelector(selectProtectionPlansLoading);
  const error = useSelector(selectProtectionPlansError);

  useEffect(() => {
    void dispatch(fetchProtectionPlansThunk());
  }, [dispatch]);

  return { plans, loading, error };
};
