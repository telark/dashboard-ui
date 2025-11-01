import { AppDispatch } from '../../store';

export interface ResourceStateConfig {
  fetchThunk: any;
  fetchSilentThunk: any;
  triggerSyncThunk: any;
  refreshAutoThunk: any;
  refreshInterval: number;
  syncThrottle: number;
  syncLsKey: string;
  onAfterLoad?: (dispatch: AppDispatch, payload: any[]) => Promise<void> | void;
}

export interface ResourceStateUtils {
  loadResource: (dispatch: AppDispatch) => Promise<void>;
  loadResourceSilent: (dispatch: AppDispatch) => Promise<boolean>;
  handleInitialSync: (dispatch: AppDispatch) => Promise<void>;
  setupAutoRefresh: (dispatch: AppDispatch, onCleanup: (cleanupFn: () => void) => void) => void;
}

export const createResourceStateUtils = (config: ResourceStateConfig): ResourceStateUtils => {
  const {
    fetchThunk,
    fetchSilentThunk,
    triggerSyncThunk,
    refreshAutoThunk,
    refreshInterval,
    syncThrottle,
    syncLsKey,
    onAfterLoad,
  } = config;

  const loadResource = async (dispatch: AppDispatch): Promise<void> => {
    const result = await dispatch(fetchThunk());
    if (fetchThunk.fulfilled.match(result) && onAfterLoad) {
      await onAfterLoad(dispatch, result.payload);
    }
  };

  const loadResourceSilent = async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const result = await dispatch(fetchSilentThunk());
      return fetchSilentThunk.fulfilled.match(result);
    } catch {
      return false;
    }
  };

  const handleInitialSync = async (dispatch: AppDispatch): Promise<void> => {
    try {
      const now = Date.now();
      const lastStr = localStorage.getItem(syncLsKey);
      const last = lastStr ? parseInt(lastStr, 10) : 0;

      if (!last || now - last >= syncThrottle) {
        dispatch(triggerSyncThunk());
        localStorage.setItem(syncLsKey, String(now));
      }
    } catch {
      // Fallback without persistence
      dispatch(triggerSyncThunk());
    }
  };

  const setupAutoRefresh = (
    dispatch: AppDispatch,
    onCleanup: (cleanupFn: () => void) => void,
  ): void => {
    const now = Date.now();
    const remainder = now % refreshInterval;
    const initialDelay = remainder === 0 ? refreshInterval : refreshInterval - remainder;

    const timeoutId = window.setTimeout(() => {
      dispatch(refreshAutoThunk());
      const intervalId = window.setInterval(() => {
        dispatch(refreshAutoThunk());
      }, refreshInterval);

      // Store cleanup function
      onCleanup(() => {
        window.clearTimeout(timeoutId);
        if (intervalId) window.clearInterval(intervalId);
      });
    }, initialDelay);
  };

  return {
    loadResource,
    loadResourceSilent,
    handleInitialSync,
    setupAutoRefresh,
  };
};
