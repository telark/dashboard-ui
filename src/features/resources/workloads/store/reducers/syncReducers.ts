import { PayloadAction } from '@reduxjs/toolkit';
import type { WorkloadsState } from '../../models';
import { SYNC_MODES } from '../../../../../constants/store/store';

export const handleTriggerSyncRejected = (state: WorkloadsState, action: PayloadAction<any>) => {
  state.appError = action.payload as string;
};

export const handleRefreshAutoAppsFulfilled = (
  state: WorkloadsState,
  action: PayloadAction<any[]>,
) => {
  const incoming = action.payload || [];
  const autoIncoming = incoming.filter((app: any) => app?.sync?.mode === SYNC_MODES.AUTO);

  // Create a map of existing apps by name
  const existingByName: Record<string, any> = {};
  for (const app of state.apps) {
    if (app?.name) existingByName[app.name] = app;
  }

  // Merge by name: auto items replaced from server; manual items preserved as-is
  const autoByName: Record<string, any> = {};
  for (const app of autoIncoming) {
    if (app?.name) {
      autoByName[app.name] = {
        ...app,
        // Preserve any existing state if needed
      };
    }
  }

  // Keep manual entries that aren't also present as auto with same name
  const manualExistingFiltered = state.apps.filter((app: any) => {
    const isManual = app?.sync?.mode === SYNC_MODES.MANUAL;
    const name = app?.name;
    return isManual && name && !autoByName[name];
  });

  state.apps = [...Object.values(autoByName), ...manualExistingFiltered];
};

export const handleRefreshAutoAppsRejected = (
  state: WorkloadsState,
  action: PayloadAction<any>,
) => {
  state.appError = action.payload as string;
};

export const handleUpdateSyncModeFulfilled = (
  state: WorkloadsState,
  action: PayloadAction<any>,
) => {
  const updatedItem = action.payload;
  const index = state.apps.findIndex((workload) => workload.name === updatedItem.fasid?.name);
  if (index !== -1) {
    state.apps[index] = {
      ...state.apps[index],
      lastUpdate: updatedItem.config?.sync?.lastUpdateTime || state.apps[index].lastUpdate,
    };
  }

  state.appDetails = updatedItem;
};

export const handleUpdateSyncModeRejected = (state: WorkloadsState, action: PayloadAction<any>) => {
  state.appError = action.payload as string;
};
