import { PayloadAction } from '@reduxjs/toolkit';
import { GrouperState } from '../../../interfaces/grouper';
import { STORE_MESSAGES } from '../../../constants';

export const handleUpdateMaintenanceModePending = (state: GrouperState) => {
  state.loading = true;
  state.error = null;
};

export const handleUpdateMaintenanceModeFulfilled = (
  state: GrouperState,
  action: PayloadAction<any>,
) => {
  state.loading = false;
  // eslint-disable-next-line no-console
  console.warn(STORE_MESSAGES.MAINTENANCE_UPDATED, action.payload);

  // Update the grouper in the list with the new maintenance data
  const grouperIndex = state.groupers.findIndex((g) => g.name === action.payload.name);
  if (grouperIndex !== -1 && action.payload.maintenance) {
    state.groupers[grouperIndex].maintenance = action.payload.maintenance;
    state.groupers[grouperIndex].hasMaintenance = true;
  }

  // Update details if it's the same grouper
  if (state.details?.name === action.payload.name && action.payload.maintenance) {
    state.details.maintenance = action.payload.maintenance;
    state.details.hasMaintenance = true;
  }
};

export const handleUpdateMaintenanceModeRejected = (
  state: GrouperState,
  action: PayloadAction<any>,
) => {
  state.loading = false;
  state.error = action.payload;
};

export const handleEnableMaintenanceModeFulfilled = (
  state: GrouperState,
  action: PayloadAction<any>,
) => {
  state.loading = false;

  // Update the grouper in the list with the new maintenance data
  const grouperIndex = state.groupers.findIndex((g) => g.name === action.payload.name);
  if (grouperIndex !== -1 && action.payload.maintenance) {
    state.groupers[grouperIndex].maintenance = action.payload.maintenance;
    state.groupers[grouperIndex].hasMaintenance = true;
  }

  // Update details if it's the same grouper
  if (state.details?.name === action.payload.name && action.payload.maintenance) {
    state.details.maintenance = action.payload.maintenance;
    state.details.hasMaintenance = true;
  }
};

export const handleEnableMaintenanceModeRejected = (
  state: GrouperState,
  action: PayloadAction<any>,
) => {
  state.loading = false;
  state.error = action.payload;
};

export const handleRemoveMaintenanceModeFulfilled = (
  state: GrouperState,
  action: PayloadAction<any>,
) => {
  // Update the grouper in the list to remove maintenance data instead of filtering it out
  const grouperIndex = state.groupers.findIndex((g) => g.name === action.payload.name);
  if (grouperIndex !== -1) {
    state.groupers[grouperIndex].maintenance = null;
    state.groupers[grouperIndex].hasMaintenance = false;
  }

  // Update details if it's the same grouper
  if (state.details?.name === action.payload.name) {
    state.details.maintenance = null;
    state.details.hasMaintenance = false;
  }
};

export const handleRemoveMaintenanceModeRejected = (
  state: GrouperState,
  action: PayloadAction<any>,
) => {
  state.error = action.payload;
};
