import { RootState } from '../store';
import {
  fetchAllAppsWorkloadsThunk,
  fetchAppWorkloadDetailsThunk,
} from '../features/workloads/store/thunks/fetchThunks';
import {
  fetchAllGroupersThunk,
  fetchGrouperDetailsThunk,
} from '../features/groupers/store/thunks/fetchThunks';
import { SyncConfig } from '../interfaces/resources/sync';
import { SYNC_CONSTANTS } from '../constants/config/sync';
import { BRIDGE_DETAILS_CONSTANTS } from '../features/bridges/constants';
import {
  fetchAllBridgesThunk,
  fetchBridgeDetailsThunk,
} from '../features/bridges/store/thunks/fetchThunks';
import { GROUPER_DETAILS_CONSTANTS } from '../features/groupers/constants';
import { GROUPER_CARD_TEXTS, BRIDGE_CARD_TEXTS } from '../constants/layout/cards';

export const WORKLOAD_SYNC_CONFIG: SyncConfig = {
  cardConstants: {
    POLLING_EFFECTS: SYNC_CONSTANTS.POLLING_EFFECTS,
    POLLING: {
      INTERVAL_MS: SYNC_CONSTANTS.POLLING.INTERVAL_MS,
      MAX_WAIT_MS: SYNC_CONSTANTS.POLLING.MAX_WAIT_MS,
    },
    MESSAGE_DURATIONS: {
      SUCCESS: SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS,
      ERROR: SYNC_CONSTANTS.MESSAGE_DURATIONS.ERROR,
    },
    DEFAULT_SYNC_EFFECT: SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT,
    ERROR_KEY: SYNC_CONSTANTS.ERROR_KEY,
  },
  cardTimeoutMessage: 'Taking a bit longer than usual. Please try again in a moment.',
  getResourceList: (state: RootState) => state.workload.apps,
  getNameFromResource: (resource: any) => resource?.fasid?.name || resource?.name,
  fetchAllResourcesThunk: fetchAllAppsWorkloadsThunk,
  fetchResourceDetailsThunk: fetchAppWorkloadDetailsThunk,
};

export const BRIDGE_SYNC_CONFIG: SyncConfig = {
  detailsConstants: {
    SYNC: {
      POLLING_EFFECTS: BRIDGE_DETAILS_CONSTANTS.SYNC.POLLING_EFFECTS,
      POLLING: {
        INTERVAL_MS: BRIDGE_DETAILS_CONSTANTS.SYNC.POLLING.INTERVAL_MS,
        MAX_WAIT_MS: BRIDGE_DETAILS_CONSTANTS.SYNC.POLLING.MAX_WAIT_MS,
      },
      MESSAGE_DURATIONS: {
        SUCCESS: BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.SUCCESS,
        ERROR: BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.ERROR,
      },
      DEFAULT_SYNC_EFFECT: BRIDGE_DETAILS_CONSTANTS.SYNC.DEFAULT_SYNC_EFFECT,
      TIMEOUT_MESSAGE: BRIDGE_DETAILS_CONSTANTS.SYNC.TIMEOUT_MESSAGE,
      ERROR_KEY: BRIDGE_DETAILS_CONSTANTS.SYNC.ERROR_KEY,
    },
  },
  cardConstants: {
    POLLING_EFFECTS: SYNC_CONSTANTS.POLLING_EFFECTS,
    POLLING: {
      INTERVAL_MS: SYNC_CONSTANTS.POLLING.INTERVAL_MS,
      MAX_WAIT_MS: SYNC_CONSTANTS.POLLING.MAX_WAIT_MS,
    },
    MESSAGE_DURATIONS: {
      SUCCESS: SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS,
      ERROR: SYNC_CONSTANTS.MESSAGE_DURATIONS.ERROR,
    },
    DEFAULT_SYNC_EFFECT: SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT,
    ERROR_KEY: SYNC_CONSTANTS.ERROR_KEY,
  },
  cardTimeoutMessage: BRIDGE_CARD_TEXTS.SYNC.TIMEOUT_MESSAGE,
  getResourceList: (state: RootState) => state.bridge.bridges,
  getNameFromResource: (resource: any) => resource?.name,
  fetchAllResourcesThunk: fetchAllBridgesThunk,
  fetchResourceDetailsThunk: fetchBridgeDetailsThunk,
};

export const GROUPER_SYNC_CONFIG: SyncConfig = {
  detailsConstants: {
    SYNC: {
      POLLING_EFFECTS: GROUPER_DETAILS_CONSTANTS.SYNC.POLLING_EFFECTS,
      POLLING: {
        INTERVAL_MS: GROUPER_DETAILS_CONSTANTS.SYNC.POLLING.INTERVAL_MS,
        MAX_WAIT_MS: GROUPER_DETAILS_CONSTANTS.SYNC.POLLING.MAX_WAIT_MS,
      },
      MESSAGE_DURATIONS: {
        SUCCESS: GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.SUCCESS,
        ERROR: GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.ERROR,
      },
      DEFAULT_SYNC_EFFECT: GROUPER_DETAILS_CONSTANTS.SYNC.DEFAULT_SYNC_EFFECT,
      TIMEOUT_MESSAGE: GROUPER_DETAILS_CONSTANTS.SYNC.TIMEOUT_MESSAGE,
      ERROR_KEY: GROUPER_DETAILS_CONSTANTS.SYNC.ERROR_KEY,
    },
  },
  cardConstants: {
    POLLING_EFFECTS: SYNC_CONSTANTS.POLLING_EFFECTS,
    POLLING: {
      INTERVAL_MS: SYNC_CONSTANTS.POLLING.INTERVAL_MS,
      MAX_WAIT_MS: SYNC_CONSTANTS.POLLING.MAX_WAIT_MS,
    },
    MESSAGE_DURATIONS: {
      SUCCESS: SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS,
      ERROR: SYNC_CONSTANTS.MESSAGE_DURATIONS.ERROR,
    },
    DEFAULT_SYNC_EFFECT: SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT,
    ERROR_KEY: SYNC_CONSTANTS.ERROR_KEY,
  },
  cardTimeoutMessage: GROUPER_CARD_TEXTS.SYNC.TIMEOUT_MESSAGE,
  getResourceList: (state: RootState) => state.grouper.groupers,
  getNameFromResource: (resource: any) => resource?.name,
  fetchAllResourcesThunk: fetchAllGroupersThunk,
  fetchResourceDetailsThunk: fetchGrouperDetailsThunk,
};
