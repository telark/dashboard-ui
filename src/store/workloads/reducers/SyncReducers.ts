import { PayloadAction } from '@reduxjs/toolkit';
import { WorkloadsState } from '../../../interfaces/workload';

export const handleTriggerSyncRejected = (state: WorkloadsState, action: PayloadAction<any>) => {
  state.appError = action.payload as string;
};

export const handleUpdateSyncModeFulfilled = (state: WorkloadsState, action: PayloadAction<any>) => {
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

