import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RETRY_STATUS } from '../constants';

export type RetryStatus = (typeof RETRY_STATUS)[keyof typeof RETRY_STATUS];

export interface RetryStateEntry {
  key: string;
  attempt: number;
  lastAttemptAt: number;
  nextAttemptAt: number;
  status: RetryStatus;
}

interface RetryState {
  byKey: Record<string, RetryStateEntry>;
}

const initialState: RetryState = {
  byKey: {},
};

const retrySlice = createSlice({
  name: 'retry',
  initialState,
  reducers: {
    upsertRetryState(state, action: PayloadAction<RetryStateEntry>) {
      state.byKey[action.payload.key] = action.payload;
    },
    removeRetryState(state, action: PayloadAction<string>) {
      delete state.byKey[action.payload];
    },
  },
});

export const { upsertRetryState, removeRetryState } = retrySlice.actions;
export const retryReducer = retrySlice.reducer;
