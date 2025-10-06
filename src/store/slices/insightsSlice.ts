import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { checkClusterInsights } from '../../clients/exporter';

export interface InsightsState {
  hasClusterInsight: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: InsightsState = {
  hasClusterInsight: false,
  loading: false,
  error: null,
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
      })
      .addCase(checkClusterInsightsThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setHasClusterInsight } = insightsSlice.actions;
export default insightsSlice.reducer;


