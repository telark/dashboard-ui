import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAuthConfig } from '../../clients';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../constants/store/store';
import type { RootState } from '../../../../store';
import type { AuthConfigData, AuthConfigState } from '../../models';
import logger from '../../../../logging';

export const AUTH_CONFIG_CACHE_TTL_MS = 5 * 60 * 1000;

const initialState: AuthConfigState = {
  initialized: false,
  loading: false,
  error: null,
  data: null,
  lastFetchedAt: null,
};

const isFresh = (lastFetchedAt: number | null): boolean =>
  lastFetchedAt !== null && Date.now() - lastFetchedAt < AUTH_CONFIG_CACHE_TTL_MS;

export const fetchAuthConfigThunk = createAsyncThunk<AuthConfigData>(
  STORE_ACTIONS.AUTH_CONFIG.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      return await getAuthConfig();
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_AUTH_CONFIG, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_AUTH_CONFIG));
    }
  },
);

export const ensureAuthConfigThunk = createAsyncThunk<void, void, { state: RootState }>(
  STORE_ACTIONS.AUTH_CONFIG.ENSURE,
  async (_, { dispatch, getState }) => {
    const { lastFetchedAt, loading } = getState().authConfig;
    if (loading || isFresh(lastFetchedAt)) return;
    await dispatch(fetchAuthConfigThunk());
  },
);

const authConfigSlice = createSlice({
  name: 'authConfig',
  initialState,
  reducers: {
    setAuthConfig(state, action: PayloadAction<AuthConfigData | null>) {
      state.data = action.payload;
      state.error = null;
      state.initialized = true;
      state.lastFetchedAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthConfigThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthConfigThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.initialized = true;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchAuthConfigThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(
          action.payload ?? action.error?.message ?? STORE_ERRORS.FETCH_AUTH_CONFIG,
        );
        state.initialized = true;
      });
  },
});

export const { setAuthConfig } = authConfigSlice.actions;
export default authConfigSlice.reducer;

export const selectAuthConfigState = (s: RootState) => s.authConfig;
export const selectSelfRegistrationEnabled = (s: RootState): boolean => {
  const enabled = s.authConfig.data?.selfRegistrationEnabled;
  return enabled !== false;
};
