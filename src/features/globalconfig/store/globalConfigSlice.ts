import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client, exporterApiClient } from '../../../api';
import { Endpoints } from '../../../constants';
import type { RootState } from '../../../store';
import type { ResourceDetailsResponse } from '../../../interfaces/http';

export const GLOBAL_CONFIG_CACHE_TTL_MS = 5 * 60 * 1000;

export type GlobalConfigModel = {
  ai?: { enabled?: boolean; model?: string; autoAnalyze?: boolean };
  oidc?: {
    enabled?: boolean;
    googleClientID?: string;
    egressAllowed?: boolean;
    googleJwkJson?: string;
  };
  selfRegistration?: { enabled?: boolean };
  excludedNamespaces?: string[];
  userSettings?: { fetchIntervalSeconds?: number };
  snapshots?: { maxPerApp?: number };
  cluster?: { version?: string };
};

export type GlobalConfigState = {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  data: GlobalConfigModel | null;
  lastFetchedAt: number | null;
};

const initialState: GlobalConfigState = {
  initialized: false,
  loading: false,
  error: null,
  data: null,
  lastFetchedAt: null,
};

const isFresh = (lastFetchedAt: number | null): boolean =>
  lastFetchedAt !== null && Date.now() - lastFetchedAt < GLOBAL_CONFIG_CACHE_TTL_MS;

export const fetchGlobalConfigThunk = createAsyncThunk<GlobalConfigModel>(
  'globalconfig/fetch',
  async () => {
    const resp = await Client<ResourceDetailsResponse<GlobalConfigModel>>(
      exporterApiClient,
      Endpoints.GLOBALCONFIG.GET.path,
      { method: Endpoints.GLOBALCONFIG.GET.method },
    );
    return resp?.data ?? {};
  },
);

export const ensureGlobalConfigThunk = createAsyncThunk<void, void, { state: RootState }>(
  'globalconfig/ensure',
  async (_, { dispatch, getState }) => {
    const { lastFetchedAt, loading } = getState().globalconfig;
    if (loading || isFresh(lastFetchedAt)) return;
    await dispatch(fetchGlobalConfigThunk());
  },
);

const globalConfigSlice = createSlice({
  name: 'globalconfig',
  initialState,
  reducers: {
    setGlobalConfig(state, action: PayloadAction<GlobalConfigModel | null>) {
      state.data = action.payload;
      state.error = null;
      state.initialized = true;
      state.lastFetchedAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalConfigThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalConfigThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.initialized = true;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchGlobalConfigThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.error?.message || 'Failed to load GlobalConfig');
        state.initialized = true;
      });
  },
});

export const { setGlobalConfig } = globalConfigSlice.actions;
export default globalConfigSlice.reducer;

export const selectGlobalConfigState = (s: RootState) => s.globalconfig;
