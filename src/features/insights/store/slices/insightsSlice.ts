import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { checkClusterInsights } from '../../clients';
import { STORAGE_KEYS, STORE_ACTIONS, STORE_ERRORS } from '../../../../constants/store/store';
import { INSIGHTS_CONSTANTS } from '../../constants';
import { extractErrorMessage } from '../../../../utils/helpers/format';

export interface InsightsState {
  hasClusterInsight: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const getInitialHasClusterInsight = (): boolean => {
  try {
    const stored = globalThis.localStorage.getItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS);
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
        return rejectWithValue(INSIGHTS_CONSTANTS.ERROR.NETWORK_UNAVAILABLE);
      }
      return Boolean(res?.data);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.CHECK_INSIGHTS));
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
          globalThis.localStorage.setItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS, 'true');
        } else {
          globalThis.localStorage.removeItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS);
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
            globalThis.localStorage.setItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS, 'true');
          } else {
            globalThis.localStorage.removeItem(STORAGE_KEYS.HAS_CLUSTER_INSIGHTS);
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
