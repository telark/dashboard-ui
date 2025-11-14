import { App as AntdApp } from 'antd';
import { RootState } from '../../store';

export interface DetailsSyncParams {
  details: any;
  setSyncing: (syncing: boolean) => void;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}

export interface SyncParams {
  name: string;
  syncName?: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
  setSyncing: (syncing: boolean) => void;
}

export type MessageApi = ReturnType<typeof import('antd').App.useApp>['message'];

export interface HandleSyncEffectParams {
  effect: string;
  resourceDetails?: any;
  name?: string;
  key: string;
  message: MessageApi;
  config: SyncConfig;
}

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

export interface HandleSyncErrorParams {
  err: any;
  message: MessageApi;
  isDetailsSync: boolean;
  config: SyncConfig;
}

