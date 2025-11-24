import { fetchAllBridgesThunk, fetchAllBridgesSilentThunk } from '../../store/thunks/fetchThunks';
import { triggerBridgesSyncThunk, refreshAutoBridgesThunk } from '../../store/thunks/syncThunks';
import {
  BRIDGES_REFRESH_INTERVAL_MS,
  BRIDGES_SYNC_LS_KEY,
  BRIDGES_SYNC_THROTTLE_MS,
} from '../../../../../constants/config/sync';
import { createResourceStateUtils } from '../../../../../utils/shared/resourceStateFactory';

const bridgeStateUtils = createResourceStateUtils({
  fetchThunk: fetchAllBridgesThunk,
  fetchSilentThunk: fetchAllBridgesSilentThunk,
  triggerSyncThunk: triggerBridgesSyncThunk,
  refreshAutoThunk: refreshAutoBridgesThunk,
  refreshInterval: BRIDGES_REFRESH_INTERVAL_MS,
  syncThrottle: BRIDGES_SYNC_THROTTLE_MS,
  syncLsKey: BRIDGES_SYNC_LS_KEY,
});

export const loadBridges = bridgeStateUtils.loadResource;
export const loadBridgesSilent = bridgeStateUtils.loadResourceSilent;
export const handleInitialSync = bridgeStateUtils.handleInitialSync;
export const setupAutoRefresh = bridgeStateUtils.setupAutoRefresh;
