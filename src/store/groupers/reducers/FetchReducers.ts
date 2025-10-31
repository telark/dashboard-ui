import { PayloadAction } from '@reduxjs/toolkit';
import { GrouperState } from '../../../interfaces/grouper';
import { generateMaintenanceFeatureName } from '../../../utils/helpers/format';

export const handleFetchGroupersPending = (state: GrouperState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchGroupersFulfilled = (state: GrouperState, action: PayloadAction<any[]>) => {
  state.loading = false;
  
  // Preserve maintenance state when updating groupers list
  const existingByName: Record<string, any> = {};
  for (const g of state.groupers) {
    if (g?.name) existingByName[g.name] = g;
  }
  
  const updatedGroupers = action.payload.map((g: any) => {
    const existingGrouper = existingByName[g.name];
    return {
      ...g,
      // Preserve maintenance data from existing state
      maintenance: existingGrouper?.maintenance || g.maintenance,
      hasMaintenance: existingGrouper?.hasMaintenance || g.hasMaintenance,
    };
  });
  
  state.groupers = updatedGroupers;
};

export const handleFetchGroupersRejected = (state: GrouperState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload;
};

export const handleFetchGroupersSilentPending = (state: GrouperState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchGroupersSilentFulfilled = (state: GrouperState, action: PayloadAction<any[]>) => {
  state.loading = false;
  
  // Preserve maintenance state when updating groupers list
  const existingByName: Record<string, any> = {};
  for (const g of state.groupers) {
    if (g?.name) existingByName[g.name] = g;
  }
  
  const updatedGroupers = action.payload.map((g: any) => {
    const existingGrouper = existingByName[g.name];
    return {
      ...g,
      // Preserve maintenance data from existing state
      maintenance: existingGrouper?.maintenance || g.maintenance,
      hasMaintenance: existingGrouper?.hasMaintenance || g.hasMaintenance,
    };
  });
  
  state.groupers = updatedGroupers;
};

export const handleFetchGroupersSilentRejected = (state: GrouperState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload;
};

export const handleFetchGrouperDetailsPending = (state: GrouperState) => {
  state.loading = true;
  state.details = null; // Clear details on new fetch
  state.error = null;
};

export const handleFetchGrouperDetailsFulfilled = (state: GrouperState, action: PayloadAction<any>) => {
  state.loading = false;
  const updatedGrouper = action.payload;
  state.details = updatedGrouper; // Populate details with fresh data
  
  // Also update the grouper in the list if it exists (for card view refresh)
  const index = state.groupers.findIndex((grouper) => grouper.name === updatedGrouper.name);
  if (index !== -1) {
    // Preserve maintenance data from existing state when updating the list
    const existingGrouper = state.groupers[index];
    state.groupers[index] = {
      ...updatedGrouper,
      maintenance: existingGrouper.maintenance || updatedGrouper.maintenance,
      hasMaintenance: existingGrouper.hasMaintenance || updatedGrouper.hasMaintenance,
    };
  }
};

export const handleFetchGrouperDetailsRejected = (state: GrouperState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload;
};

export const handleCheckMaintenanceModeFulfilled = (state: GrouperState, action: PayloadAction<any>) => {
  const maintenanceData = action.payload;
  const index = state.groupers.findIndex(
    (grouper) => generateMaintenanceFeatureName(grouper.name) === maintenanceData.name,
  );
  if (index !== -1) {
    state.groupers[index].maintenance = maintenanceData;
  }
};
