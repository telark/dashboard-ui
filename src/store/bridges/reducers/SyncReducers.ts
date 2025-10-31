import { PayloadAction } from '@reduxjs/toolkit';
import { BridgeState } from '../../../interfaces/bridge';
import { SYNC_MODES } from '../../../constants';

export const handleTriggerSyncRejected = (state: BridgeState, action: PayloadAction<any>) => {
  state.error = action.payload;
};

export const handleRefreshAutoBridgesFulfilled = (
  state: BridgeState,
  action: PayloadAction<any[]>,
) => {
  const incoming = action.payload || [];
  const autoIncoming = incoming.filter((b: any) => b?.sync?.mode === SYNC_MODES.AUTO);

  // Create a map of existing bridges by name
  const existingByName: Record<string, any> = {};
  for (const b of state.bridges) {
    if (b?.name) existingByName[b.name] = b;
  }

  // Merge by name: auto items replaced from server; manual items preserved as-is
  const autoByName: Record<string, any> = {};
  for (const b of autoIncoming) {
    if (b?.name) {
      autoByName[b.name] = b;
    }
  }

  // Keep manual entries that aren't also present as auto with same name
  const manualExistingFiltered = state.bridges.filter((b: any) => {
    const isManual = b?.sync?.mode === SYNC_MODES.MANUAL;
    const name = b?.name;
    return isManual && name && !autoByName[name];
  });

  state.bridges = [...Object.values(autoByName), ...manualExistingFiltered];
};

export const handleRefreshAutoBridgesRejected = (
  state: BridgeState,
  action: PayloadAction<any>,
) => {
  state.error = action.payload;
};

export const handleUpdateSyncModeFulfilled = (state: BridgeState, action: PayloadAction<any>) => {
  const updatedItem = action.payload;

  // Update the bridges list with the updated sync settings
  const index = state.bridges.findIndex((bridge) => bridge.name === updatedItem.name);
  if (index !== -1) {
    // Update relevant fields for the specific bridge
    state.bridges[index] = {
      ...state.bridges[index],
      sync: updatedItem.sync,
      history: updatedItem.history,
    };
  }

  // Update the details to reflect the most recent data
  if (state.details) {
    state.details = updatedItem;
  } else {
    state.details = updatedItem;
  }
};

export const handleUpdateSyncModeRejected = (state: BridgeState, action: PayloadAction<any>) => {
  state.error = action.payload;
};

