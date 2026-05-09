import { createSlice } from '@reduxjs/toolkit';
import type { ProtectionPlansState } from '../../models';
import {
  fetchProtectionPlansThunk,
  fetchProtectionPlanDetailsThunk,
  fetchProtectionPlanTemplatesThunk,
  preparePlanThunk,
  cancelPlanThunk,
  deletePlanThunk,
  duplicatePlanThunk,
} from '../thunks/protectionPlansThunks';

const initialState: ProtectionPlansState = {
  plans: [],
  templates: [],
  loading: false,
  templatesLoading: false,
  error: null,
  details: null,
  detailsLoading: false,
  detailsError: null,
};

const protectionPlansSlice = createSlice({
  name: 'protectionPlans',
  initialState,
  reducers: {
    clearPlanDetails: (state) => {
      state.details = null;
      state.detailsLoading = false;
      state.detailsError = null;
    },
  },
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
      .addCase(fetchProtectionPlanDetailsThunk.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchProtectionPlanDetailsThunk.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.details = action.payload;
        state.plans = state.plans.map((p) => (p.id === action.payload.id ? action.payload : p));
      })
      .addCase(fetchProtectionPlanDetailsThunk.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload as string;
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
        if (state.details?.id === action.payload.id) {
          state.details = action.payload;
        }
      })
      .addCase(deletePlanThunk.fulfilled, (state, action) => {
        state.plans = state.plans.filter((p) => p.id !== action.payload);
      })
      .addCase(duplicatePlanThunk.fulfilled, (state, action) => {
        state.plans = [action.payload, ...state.plans];
      });
  },
});

export const { clearPlanDetails } = protectionPlansSlice.actions;
export const protectionPlansReducer = protectionPlansSlice.reducer;
