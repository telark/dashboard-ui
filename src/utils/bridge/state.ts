import { AppDispatch } from '../../store';
import {
  fetchAllBridgesThunk,
  fetchAllBridgesSilentThunk,
  triggerBridgesSyncThunk,
  refreshAutoBridgesThunk,
} from '../../store/bridges/slices/bridgeSlice';
import {
  BRIDGES_REFRESH_INTERVAL_MS,
  BRIDGES_SYNC_LS_KEY,
  BRIDGES_SYNC_THROTTLE_MS,
} from '../../constants/sync';

export const loadBridges = async (dispatch: AppDispatch): Promise<void> => {
  await dispatch(fetchAllBridgesThunk());
};

export const loadBridgesSilent = async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const result = await dispatch(fetchAllBridgesSilentThunk());
    return fetchAllBridgesSilentThunk.fulfilled.match(result);
  } catch {
    return false;
  }
};

export const handleInitialSync = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const now = Date.now();
    const lastStr = localStorage.getItem(BRIDGES_SYNC_LS_KEY);
    const last = lastStr ? parseInt(lastStr, 10) : 0;

    if (!last || now - last >= BRIDGES_SYNC_THROTTLE_MS) {
      dispatch(triggerBridgesSyncThunk());
      localStorage.setItem(BRIDGES_SYNC_LS_KEY, String(now));
    }
  } catch {
    // Fallback without persistence
    dispatch(triggerBridgesSyncThunk());
  }
};

export const setupAutoRefresh = (
  dispatch: AppDispatch,
  onCleanup: (cleanupFn: () => void) => void,
): void => {
  const now = Date.now();
  const remainder = now % BRIDGES_REFRESH_INTERVAL_MS;
  const initialDelay =
    remainder === 0 ? BRIDGES_REFRESH_INTERVAL_MS : BRIDGES_REFRESH_INTERVAL_MS - remainder;

  const timeoutId = window.setTimeout(() => {
    dispatch(refreshAutoBridgesThunk());
    const intervalId = window.setInterval(() => {
      dispatch(refreshAutoBridgesThunk());
    }, BRIDGES_REFRESH_INTERVAL_MS);

    // Store cleanup function
    onCleanup(() => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    });
  }, initialDelay);
};

