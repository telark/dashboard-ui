import { AppDispatch } from '../../store';
import {
  fetchAllAppsWorkloadsThunk,
  triggerAppsSyncThunk,
  refreshAutoAppsThunk,
} from '../../store/workloads/slices/workloadSlice';
import {
  WORKLOADS_REFRESH_INTERVAL_MS,
  WORKLOADS_SYNC_LS_KEY,
  WORKLOADS_SYNC_THROTTLE_MS,
} from '../../constants/sync';

export const loadWorkloads = async (dispatch: AppDispatch): Promise<void> => {
  await dispatch(fetchAllAppsWorkloadsThunk());
};

export const loadWorkloadsSilent = async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const result = await dispatch(fetchAllAppsWorkloadsThunk());
    return fetchAllAppsWorkloadsThunk.fulfilled.match(result);
  } catch {
    return false;
  }
};

export const handleInitialSync = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const now = Date.now();
    const lastStr = localStorage.getItem(WORKLOADS_SYNC_LS_KEY);
    const last = lastStr ? parseInt(lastStr, 10) : 0;

    if (!last || now - last >= WORKLOADS_SYNC_THROTTLE_MS) {
      dispatch(triggerAppsSyncThunk());
      localStorage.setItem(WORKLOADS_SYNC_LS_KEY, String(now));
    }
  } catch {
    // Fallback without persistence
    dispatch(triggerAppsSyncThunk());
  }
};

export const setupAutoRefresh = (
  dispatch: AppDispatch,
  onCleanup: (cleanupFn: () => void) => void,
): void => {
  const now = Date.now();
  const remainder = now % WORKLOADS_REFRESH_INTERVAL_MS;
  const initialDelay =
    remainder === 0 ? WORKLOADS_REFRESH_INTERVAL_MS : WORKLOADS_REFRESH_INTERVAL_MS - remainder;

  const timeoutId = window.setTimeout(() => {
    dispatch(refreshAutoAppsThunk());
    const intervalId = window.setInterval(() => {
      dispatch(refreshAutoAppsThunk());
    }, WORKLOADS_REFRESH_INTERVAL_MS);

    // Store cleanup function
    onCleanup(() => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    });
  }, initialDelay);
};

