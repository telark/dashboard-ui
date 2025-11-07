import { PayloadAction } from '@reduxjs/toolkit';
import { WorkloadsState } from '../../../interfaces/workload';

export const handleFetchAppsPending = (state: WorkloadsState) => {
  state.appLoading = true;
  state.appError = null;
};

export const handleFetchAppsFulfilled = (state: WorkloadsState, action: PayloadAction<any[]>) => {
  state.appLoading = false;
  state.apps = action.payload;
  state.appError = null;
};

export const handleFetchAppsRejected = (state: WorkloadsState, action: PayloadAction<any>) => {
  state.appLoading = false;
  state.appError = action.payload as string;
};

export const handleFetchAppDetailsPending = (state: WorkloadsState) => {
  state.appLoading = true;
  state.appError = null;
};

export const handleFetchAppDetailsFulfilled = (
  state: WorkloadsState,
  action: PayloadAction<any>,
) => {
  state.appLoading = false;
  const updatedWorkload = action.payload;
  state.appDetails = updatedWorkload;
  state.appError = null;

  // Also update the workload in the list if it exists (for card view refresh)
  const workloadName = updatedWorkload.fasid?.name;
  if (workloadName) {
    const index = state.apps.findIndex((app) => app.name === workloadName);
    if (index !== -1) {
      // Calculate containers from crates
      const containers =
        (updatedWorkload.cacid?.crates?.regular?.length || 0) +
        (updatedWorkload.cacid?.crates?.init?.length || 0);

      // Update the workload in the list with fresh data
      state.apps[index] = {
        ...state.apps[index],
        sourceName: updatedWorkload.fasid?.sourceName || state.apps[index].sourceName,
        status: updatedWorkload.cacid?.status || state.apps[index].status,
        instances: updatedWorkload.cacid?.instances || state.apps[index].instances,
        containers: containers || state.apps[index].containers,
        bridges: updatedWorkload.cacid?.bridges?.length || state.apps[index].bridges,
        lastUpdate: updatedWorkload.config?.sync?.lastUpdateTime || state.apps[index].lastUpdate,
        creationTime: updatedWorkload.fasid?.creationTime || state.apps[index].creationTime,
        // Preserve other fields that might not be in details
      };
    }
  }
};

export const handleFetchAppDetailsRejected = (
  state: WorkloadsState,
  action: PayloadAction<any>,
) => {
  state.appLoading = false;
  state.appError = action.payload as string;
};

export const handleFetchBatchesPending = (state: WorkloadsState) => {
  state.batchLoading = true;
  state.batchError = null;
};

export const handleFetchBatchesFulfilled = (
  state: WorkloadsState,
  action: PayloadAction<any[]>,
) => {
  state.batchLoading = false;
  state.batches = action.payload;
  state.batchError = null;
};

export const handleFetchBatchesRejected = (state: WorkloadsState, action: PayloadAction<any>) => {
  state.batchLoading = false;
  state.batchError = action.payload as string;
};
