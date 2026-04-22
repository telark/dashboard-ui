import { RootState } from '../../store';

export interface SyncConfig {
  detailsConstants?: {
    SYNC: {
      POLLING_EFFECTS: readonly string[];
      POLLING: {
        INTERVAL_MS: number;
        MAX_WAIT_MS: number;
      };
      MESSAGE_DURATIONS: {
        SUCCESS: number;
        ERROR: number;
      };
      DEFAULT_SYNC_EFFECT: string;
      TIMEOUT_MESSAGE: string;
      ERROR_KEY: string;
    };
  };
  cardConstants: {
    POLLING_EFFECTS: readonly string[];
    POLLING: {
      INTERVAL_MS: number;
      MAX_WAIT_MS: number;
    };
    MESSAGE_DURATIONS: {
      SUCCESS: number;
      ERROR: number;
    };
    DEFAULT_SYNC_EFFECT: string;
    ERROR_KEY: string;
  };
  cardTimeoutMessage: string;
  getResourceList: (state: RootState) => any[];
  getNameFromResource: (resource: any) => string;
  fetchAllResourcesThunk: any;
  fetchResourceDetailsThunk: (name: string) => any;
}
