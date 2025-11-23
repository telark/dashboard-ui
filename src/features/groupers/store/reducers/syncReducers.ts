import { PayloadAction } from '@reduxjs/toolkit';
import type { GrouperState } from '../../models';
import { SYNC_MODES } from '../../../../constants/store/store';

export const handleTriggerSyncRejected = (state: GrouperState, action: PayloadAction<any>) => {
  state.error = action.payload;
};

export const handleRefreshAutoGroupersFulfilled = (
  state: GrouperState,
  action: PayloadAction<any[]>,
) => {
  const incoming = action.payload || [];
  const autoIncoming = incoming.filter((g: any) => g?.sync?.mode === SYNC_MODES.AUTO);

  // Create a map of existing groupers by name to preserve maintenance state
  const existingByName: Record<string, any> = {};
  for (const g of state.groupers) {
    if (g?.name) existingByName[g.name] = g;
  }

  // Merge by name: auto items replaced from server; manual items preserved as-is
  const autoByName: Record<string, any> = {};
  for (const g of autoIncoming) {
    if (g?.name) {
      // Preserve maintenance state from existing grouper if it exists
      const existingGrouper = existingByName[g.name];
      autoByName[g.name] = {
        ...g,
        // Preserve maintenance data from existing state
        maintenance: existingGrouper?.maintenance || g.maintenance,
        hasMaintenance: existingGrouper?.hasMaintenance || g.hasMaintenance,
      };
    }
  }

  // Keep manual entries that aren't also present as auto with same name
  const manualExistingFiltered = state.groupers.filter((g: any) => {
    const isManual = g?.sync?.mode === SYNC_MODES.MANUAL;
    const name = g?.name;
    return isManual && name && !autoByName[name];
  });

  state.groupers = [...Object.values(autoByName), ...manualExistingFiltered];
};

export const handleRefreshAutoGroupersRejected = (
  state: GrouperState,
  action: PayloadAction<any>,
) => {
  state.error = action.payload;
};

export const handleUpdateSyncModeFulfilled = (state: GrouperState, action: PayloadAction<any>) => {
  const updatedItem = action.payload;

  // Update the groupers list with the updated sync settings
  const index = state.groupers.findIndex((grouper) => grouper.name === updatedItem.name);
  if (index !== -1) {
    // Update relevant fields for the specific grouper
    state.groupers[index] = {
      ...state.groupers[index],
      sync: updatedItem.sync,
      history: updatedItem.history,
    };
  }

  // Update the details to reflect the most recent data while preserving maintenance data
  if (state.details) {
    state.details = {
      ...updatedItem,
      maintenance: state.details.maintenance, // Preserve existing maintenance data
    };
  } else {
    state.details = updatedItem;
  }
};

export const handleUpdateSyncModeRejected = (state: GrouperState, action: PayloadAction<any>) => {
  state.error = action.payload;
};
