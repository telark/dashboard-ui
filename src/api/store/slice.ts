import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  initialHealth,
  recordFailure,
  recordSuccess,
  transitionToHalfOpen,
} from '../health/circuit-breaker';
import type { ServiceHealth, ServiceHealthMap } from '../types';

export interface ApiHealthState {
  services: ServiceHealthMap;
}

const initialState: ApiHealthState = {
  services: {},
};

const getOrInit = (state: ApiHealthState, name: string): ServiceHealth => {
  return state.services[name] ?? { ...initialHealth };
};

const apiHealthSlice = createSlice({
  name: 'apiHealth',
  initialState,
  reducers: {
    requestStarted(state, action: PayloadAction<string>) {
      const name = action.payload;
      const current = getOrInit(state, name);
      const next = transitionToHalfOpen(current, new Date());
      state.services[name] = next;
    },
    requestSucceeded(state, action: PayloadAction<string>) {
      const name = action.payload;
      const current = getOrInit(state, name);
      state.services[name] = recordSuccess(current);
    },
    requestFailed(state, action: PayloadAction<string>) {
      const name = action.payload;
      const current = getOrInit(state, name);
      state.services[name] = recordFailure(current, new Date());
    },
    cooldownLogged(state, action: PayloadAction<string>) {
      const name = action.payload;
      const current = state.services[name];
      if (!current) return;
      state.services[name] = { ...current, cooldownLogAt: new Date().toISOString() };
    },
    resetService(state, action: PayloadAction<string>) {
      state.services[action.payload] = { ...initialHealth };
    },
  },
});

export const { requestStarted, requestSucceeded, requestFailed, cooldownLogged, resetService } =
  apiHealthSlice.actions;

export const apiHealthReducer = apiHealthSlice.reducer;
