import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { keepUnchanged } from '../../../../../store/keepUnchanged';
import type { PlanPhaseQuickFilter, ProtectionPlansState } from '../../models';
import {
  fetchProtectionPlansThunk,
  fetchProtectionPlanDetailsThunk,
  fetchProtectionPlanTemplatesThunk,
  preparePlanThunk,
  cancelPlanThunk,
  decidePlanThunk,
  deletePlanThunk,
  duplicatePlanThunk,
  reactivatePlanThunk,
  updatePlanThunk,
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
  phaseQuickFilter: 'all',
  appliedFilters: {},
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
    setPhaseQuickFilter: (state, action: PayloadAction<PlanPhaseQuickFilter>) => {
      state.phaseQuickFilter = action.payload;
    },
    setAppliedPlanFilters: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.appliedFilters = action.payload;
    },
    clearAppliedPlanFilters: (state) => {
      state.appliedFilters = {};
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
        state.plans = keepUnchanged(state.plans, action.payload, (plan) => plan.id);
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
      })
      .addCase(reactivatePlanThunk.fulfilled, (state, action) => {
        state.plans = state.plans.map((p) => (p.id === action.payload.id ? action.payload : p));
        if (state.details?.id === action.payload.id) {
          state.details = action.payload;
        }
      })
      .addCase(decidePlanThunk.fulfilled, (state, action) => {
        state.plans = state.plans.map((p) => (p.id === action.payload.id ? action.payload : p));
        if (state.details?.id === action.payload.id) {
          state.details = action.payload;
        }
      })
      .addCase(updatePlanThunk.fulfilled, (state, action) => {
        state.plans = state.plans.map((p) => (p.id === action.payload.id ? action.payload : p));
        if (state.details?.id === action.payload.id) {
          state.details = action.payload;
        }
      });
  },
});

export const {
  clearPlanDetails,
  setPhaseQuickFilter,
  setAppliedPlanFilters,
  clearAppliedPlanFilters,
} = protectionPlansSlice.actions;
export const protectionPlansReducer = protectionPlansSlice.reducer;
