import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../../store';
import { POLL_INTERVAL_MS } from '../../../../constants';
import { pollWhileVisible } from '../../../../utils/helpers/poll';
import {
  fetchProtectionPlansThunk,
  selectProtectionPlans,
  selectProtectionPlansLoaded,
  selectProtectionPlansError,
} from '../store';

export const useProtectionPlans = (enabled = true) => {
  const dispatch: AppDispatch = useDispatch();
  const plans = useSelector(selectProtectionPlans);
  const loaded = useSelector(selectProtectionPlansLoaded);
  const error = useSelector(selectProtectionPlansError);

  // A window starts and ends on its exact boundary, so a list fetched once on
  // mount shows a plan as scheduled long after it began enforcing.
  useEffect(() => {
    if (!enabled) return undefined;
    void dispatch(fetchProtectionPlansThunk());

    return pollWhileVisible(() => void dispatch(fetchProtectionPlansThunk()), POLL_INTERVAL_MS);
  }, [dispatch, enabled]);

  const refetch = useCallback((): void => {
    void dispatch(fetchProtectionPlansThunk());
  }, [dispatch]);

  return { plans, loaded, error, refetch };
};
