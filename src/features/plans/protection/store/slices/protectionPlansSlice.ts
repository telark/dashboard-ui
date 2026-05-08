import { createSlice } from '@reduxjs/toolkit';
import type { ProtectionPlansState } from '../../models';
import {
  fetchProtectionPlansThunk,
  fetchProtectionPlanTemplatesThunk,
  preparePlanThunk,
  cancelPlanThunk,
  deletePlanThunk,
} from '../thunks/protectionPlansThunks';

const initialState: ProtectionPlansState = {
  plans: [],
  templates: [],
  loading: false,
  templatesLoading: false,
  error: null,
};

const protectionPlansSlice = createSlice({
  name: 'protectionPlans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProtectionPlansThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProtectionPlansThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchProtectionPlansThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProtectionPlanTemplatesThunk.pending, (state) => {
        state.templatesLoading = true;
      })
      .addCase(fetchProtectionPlanTemplatesThunk.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchProtectionPlanTemplatesThunk.rejected, (state) => {
        state.templatesLoading = false;
      })
      .addCase(preparePlanThunk.fulfilled, (state, action) => {
        state.plans = [action.payload, ...state.plans];
      })
      .addCase(cancelPlanThunk.fulfilled, (state, action) => {
        state.plans = state.plans.map((p) => (p.id === action.payload.id ? action.payload : p));
      })
      .addCase(deletePlanThunk.fulfilled, (state, action) => {
        state.plans = state.plans.filter((p) => p.id !== action.payload);
      });
  },
});

export const protectionPlansReducer = protectionPlansSlice.reducer;
