import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { checkClusterInsights } from '../../clients/exporter';
import { STORAGE_KEYS, STORE_ACTIONS, STORE_ERRORS, ERROR_MESSAGES } from '../../constants';

export interface InsightsState {
  hasClusterInsight: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

// Read persisted state from localStorage on startup
const getInitialHasClusterInsight = (): boolean => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS);
    return stored === 'true';
  } catch {
    return false;
  }
};

const initialState: InsightsState = {
  hasClusterInsight: getInitialHasClusterInsight(),
  loading: false,
  error: null,
  initialized: false,
};

export const checkClusterInsightsThunk = createAsyncThunk(
  STORE_ACTIONS.INSIGHTS.CHECK_CLUSTER,
  async (_, { rejectWithValue }) => {
    try {
      const res = await checkClusterInsights();
      if (res?._network) {
        return rejectWithValue(ERROR_MESSAGES.INSIGHTS.NETWORK_UNAVAILABLE);
      }
      return Boolean(res?.data);
    } catch (error: any) {
      return rejectWithValue(error?.message || STORE_ERRORS.CHECK_INSIGHTS);
    }
  },
);

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setHasClusterInsight(state, action: PayloadAction<boolean>) {
      state.hasClusterInsight = action.payload;
      try {
        if (action.payload) {
          window.localStorage.setItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS, 'true');
        } else {
          window.localStorage.removeItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS);
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
            window.localStorage.setItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS, 'true');
          } else {
            // Clear localStorage if insights are not available
            window.localStorage.removeItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS);
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
