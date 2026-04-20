import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client, exporterApiClient } from '../../../api';
import { Endpoints } from '../../../constants';
import type { RootState } from '../../../store';
import type { ResourceDetailsResponse } from '../../../interfaces/http';

export type GlobalConfigModel = {
  ai?: { enabled?: boolean; provider?: string; apiKey?: string };
  oidc?: { enabled?: boolean; googleClientId?: string };
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
};

const initialState: GlobalConfigState = {
  initialized: false,
  loading: false,
  error: null,
  data: null,
};

export const fetchGlobalConfigThunk = createAsyncThunk<GlobalConfigModel>(
  'globalconfig/fetch',
  async () => {
    const resp = await Client<ResourceDetailsResponse<GlobalConfigModel>>(
      exporterApiClient,
      Endpoints.GLOBALCONFIG.GET.path,
      { method: Endpoints.GLOBALCONFIG.GET.method },
    );
    return resp.data ?? {};
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
