import type { AppDispatch } from '../../../../store';
import {
  fetchAllGroupersThunk,
  fetchAllGroupersSilentThunk,
  checkGrouperMaintenanceModeThunk,
} from '../../store/thunks/fetchThunks';
import { triggerGroupersSyncThunk, refreshAutoGroupersThunk } from '../../store/thunks/syncThunks';
import {
  GROUPERS_REFRESH_INTERVAL_MS,
  GROUPERS_SYNC_LS_KEY,
  GROUPERS_SYNC_THROTTLE_MS,
} from '../../../../constants/config/sync';
import type { GrouperInterface } from '../../models';
import { createResourceStateUtils } from '../../../../utils/shared/resourceStateFactory';

const grouperStateUtils = createResourceStateUtils({
  fetchThunk: fetchAllGroupersThunk,
  fetchSilentThunk: fetchAllGroupersSilentThunk,
  triggerSyncThunk: triggerGroupersSyncThunk,
  refreshAutoThunk: refreshAutoGroupersThunk,
  refreshInterval: GROUPERS_REFRESH_INTERVAL_MS,
  syncThrottle: GROUPERS_SYNC_THROTTLE_MS,
  syncLsKey: GROUPERS_SYNC_LS_KEY,
  onAfterLoad: async (dispatch: AppDispatch, payload: GrouperInterface[]) => {
    // Collect all maintenance checks and run them in parallel
    const maintenanceChecks = payload
      .filter((grouper) => grouper?.hasMaintenance)
      .map((grouper) => dispatch(checkGrouperMaintenanceModeThunk(grouper.name)));

    // Wait for all maintenance checks to complete in parallel
    if (maintenanceChecks.length > 0) {
      await Promise.all(maintenanceChecks);
    }
  },
});

export const loadGroupers = grouperStateUtils.loadResource;
export const loadGroupersSilent = grouperStateUtils.loadResourceSilent;
export const handleInitialSync = grouperStateUtils.handleInitialSync;
export const setupAutoRefresh = grouperStateUtils.setupAutoRefresh;
