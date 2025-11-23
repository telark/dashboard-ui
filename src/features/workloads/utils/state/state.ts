import {
  fetchAllAppsWorkloadsThunk,
} from '../../store/thunks/fetchThunks';
import {
  triggerAppsSyncThunk,
  refreshAutoAppsThunk,
} from '../../store/thunks/syncThunks';
import {
  WORKLOADS_REFRESH_INTERVAL_MS,
  WORKLOADS_SYNC_LS_KEY,
  WORKLOADS_SYNC_THROTTLE_MS,
} from '../../../../constants/config/sync';
import { createResourceStateUtils } from '../../../../utils/shared/resourceStateFactory';

const workloadStateUtils = createResourceStateUtils({
  fetchThunk: fetchAllAppsWorkloadsThunk,
  fetchSilentThunk: fetchAllAppsWorkloadsThunk,
  triggerSyncThunk: triggerAppsSyncThunk,
  refreshAutoThunk: refreshAutoAppsThunk,
  refreshInterval: WORKLOADS_REFRESH_INTERVAL_MS,
  syncThrottle: WORKLOADS_SYNC_THROTTLE_MS,
  syncLsKey: WORKLOADS_SYNC_LS_KEY,
});

export const loadWorkloads = workloadStateUtils.loadResource;
export const loadWorkloadsSilent = workloadStateUtils.loadResourceSilent;
export const handleInitialSync = workloadStateUtils.handleInitialSync;
export const setupAutoRefresh = workloadStateUtils.setupAutoRefresh;

