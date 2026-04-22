import { RootState } from '../store';
import { SyncConfig } from '../interfaces/resources/sync';
import { SYNC_CONSTANTS } from '../constants/config/sync';
import {
  fetchAllApplicationsThunk,
  fetchApplicationDetailsThunk,
} from '../features/resources/applications/store/thunks/fetchThunks';

export const APPLICATION_SYNC_CONFIG: SyncConfig = {
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
  cardTimeoutMessage: SYNC_CONSTANTS.TIMEOUT_MESSAGE,
  getResourceList: (state: RootState) => state.applications.applications,
  getNameFromResource: (resource: any) => resource?.name,
  fetchAllResourcesThunk: fetchAllApplicationsThunk,
  fetchResourceDetailsThunk: fetchApplicationDetailsThunk,
};
