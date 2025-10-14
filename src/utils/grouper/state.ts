import { AppDispatch } from '../../store';
import {
  fetchAllGroupersThunk,
  fetchAllGroupersSilentThunk,
  checkGrouperMaintenanceModeThunk,
  triggerGroupersSyncThunk,
  refreshAutoGroupersThunk,
} from '../../store/slices/grouperSlice';
import {
  GROUPERS_REFRESH_INTERVAL_MS,
  GROUPERS_SYNC_LS_KEY,
  GROUPERS_SYNC_THROTTLE_MS,
} from '../../constants/sync';

export const loadGroupers = async (dispatch: AppDispatch): Promise<void> => {
  const result = await dispatch(fetchAllGroupersThunk());
  if (fetchAllGroupersThunk.fulfilled.match(result)) {
    result.payload.forEach((grouper: any) => {
      if (grouper?.hasMaintenance) {
        dispatch(checkGrouperMaintenanceModeThunk(grouper.name));
      }
    });
  }
};

export const loadGroupersSilent = async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const result = await dispatch(fetchAllGroupersSilentThunk());
    return fetchAllGroupersSilentThunk.fulfilled.match(result);
  } catch {
    return false;
  }
};

export const handleInitialSync = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const now = Date.now();
    const lastStr = localStorage.getItem(GROUPERS_SYNC_LS_KEY);
    const last = lastStr ? parseInt(lastStr, 10) : 0;

    if (!last || now - last >= GROUPERS_SYNC_THROTTLE_MS) {
      dispatch(triggerGroupersSyncThunk());
      localStorage.setItem(GROUPERS_SYNC_LS_KEY, String(now));
    }
  } catch {
    // Fallback without persistence
    dispatch(triggerGroupersSyncThunk());
  }
};

export const setupAutoRefresh = (
  dispatch: AppDispatch,
  onCleanup: (cleanupFn: () => void) => void,
): void => {
  const now = Date.now();
  const remainder = now % GROUPERS_REFRESH_INTERVAL_MS;
  const initialDelay =
    remainder === 0 ? GROUPERS_REFRESH_INTERVAL_MS : GROUPERS_REFRESH_INTERVAL_MS - remainder;

  const timeoutId = window.setTimeout(() => {
    dispatch(refreshAutoGroupersThunk());
    const intervalId = window.setInterval(() => {
      dispatch(refreshAutoGroupersThunk());
    }, GROUPERS_REFRESH_INTERVAL_MS);

    // Store cleanup function
    onCleanup(() => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    });
  }, initialDelay);
};
