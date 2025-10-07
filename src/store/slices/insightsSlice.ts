import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { checkClusterInsights } from '../../clients/exporter';

export interface InsightsState {
  hasClusterInsight: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: InsightsState = {
  hasClusterInsight: false,
  loading: false,
  error: null,
  initialized: false,
};

export const checkClusterInsightsThunk = createAsyncThunk('insights/checkCluster', async (_, { rejectWithValue }) => {
  try {
    const res = await checkClusterInsights();
    return Boolean(res?.data);
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to check cluster insights');
  }
});

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setHasClusterInsight(state, action: PayloadAction<boolean>) {
      state.hasClusterInsight = action.payload;
      try {
        if (action.payload) {
          window.localStorage.setItem('HAS_CLUSTER_INSIGHTS', 'true');
        }
      } catch {
        // ignore persistence errors
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkClusterInsightsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkClusterInsightsThunk.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.hasClusterInsight = action.payload;
        state.initialized = true;
        try {
          if (action.payload) {
            window.localStorage.setItem('HAS_CLUSTER_INSIGHTS', 'true');
          }
        } catch {
          // ignore persistence errors
        }
      })
      .addCase(checkClusterInsightsThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      });
  },
});

export const { setHasClusterInsight } = insightsSlice.actions;
export default insightsSlice.reducer;


