import type { PayloadAction } from '@reduxjs/toolkit';
import type { ApplicationsState, Application } from '../../models';
import { STORE_ERRORS } from '../../../../../constants/store/store';

export const handleFetchApplicationsPending = (state: ApplicationsState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchApplicationsFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<Application[]>,
) => {
  state.loading = false;
  state.applications = action.payload;
  state.error = null;
};

export const handleFetchApplicationsSilentFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<Application[]>,
) => {
  state.loading = false;
  state.applications = action.payload;
  state.error = null;
  const now = new Date().toISOString();
  if (!state.syncCompletedAt) state.syncCompletedAt = {};
  for (const app of action.payload || []) {
    if (app?.name) {
      state.syncCompletedAt[app.name] = now;
    }
  }
};

export const handleFetchApplicationsRejected = (
  state: ApplicationsState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = String(action.payload || STORE_ERRORS.FETCH_APPLICATIONS);
};

export const handleFetchApplicationsSilentPending = (state: ApplicationsState) => {
  // Silent polling must not clobber visible error state; the visible fetchAll
  // thunk owns loading/error transitions. Touch state to satisfy reducer shape.
  void state;
};

export const handleFetchApplicationsSilentRejected = (
  state: ApplicationsState,
  action: PayloadAction<unknown>,
) => {
  // Only surface error when there's no successful data already; otherwise the
  // visible list stays and the silent refresh failure is suppressed.
  if (!state.applications || state.applications.length === 0) {
    state.error = String(action.payload || STORE_ERRORS.FETCH_APPLICATIONS);
  }
};

export const handleFetchApplicationDetailsPending = (state: ApplicationsState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchApplicationDetailsFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<Application>,
) => {
  state.loading = false;
  state.details = action.payload;
  state.error = null;
};

export const handleFetchApplicationDetailsRejected = (
  state: ApplicationsState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = String(action.payload || STORE_ERRORS.FETCH_APPLICATION_DETAILS);
};

export const handleUpdateApplicationFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<Application>,
) => {
  const updated = action.payload;
  const idx = state.applications.findIndex((a) => a.name === updated.name);
  if (idx >= 0) {
    state.applications[idx] = updated;
  }
  if (state.details?.name === updated.name) {
    state.details = updated;
  }
  state.error = null;
};

export const handleDeleteApplicationFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<string>,
) => {
  const name = action.payload;
  state.applications = state.applications.filter((a) => a.name !== name);
  if (state.details?.name === name) {
    state.details = null;
  }
  state.error = null;
};
