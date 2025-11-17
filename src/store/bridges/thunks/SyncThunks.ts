import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateBridgeSyncMode, fetchBridges } from '../../../clients/exporter';
import { triggerBridgesSync } from '../../../clients/sync-manager';
import { mapSingleBridgeData, mapBridgesData } from '../../../utils/mappers/bridgeMapper';
import { STORE_ACTIONS, STORE_ERRORS } from '../../../constants/store/store';
import { RootState } from '../../../store';
import { BridgeInterface } from '../../../interfaces/resources/bridge';
import { extractErrorMessage } from '../../../utils/helpers/format';

export const triggerBridgesSyncThunk = createAsyncThunk(
  STORE_ACTIONS.BRIDGES.TRIGGER_BRIDGE_SYNC,
  async (_, { rejectWithValue }) => {
    try {
      const response = await triggerBridgesSync();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.TRIGGER_BRIDGE_SYNC));
    }
  },
);

export const refreshAutoBridgesThunk = createAsyncThunk(
  STORE_ACTIONS.BRIDGES.REFRESH_AUTO_BRIDGES,
  async (_, { rejectWithValue }) => {
    try {
      const rawBridgesData = await fetchBridges();
      // Server filters to auto only
      return mapBridgesData(rawBridgesData);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.REFRESH_AUTO_BRIDGES));
    }
  },
);

export const updateBridgeSyncModeThunk = createAsyncThunk(
  STORE_ACTIONS.BRIDGE.UPDATE_SYNC,
  async ({ name, syncMode }: { name: string; syncMode: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const bridge = state.bridge.bridges.find((b: BridgeInterface) => b.name === name);
      const apiName = bridge?.syncName || name;

      const response = await updateBridgeSyncMode(apiName, syncMode);
      return mapSingleBridgeData(response.data);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_BRIDGE_SYNC));
    }
  },
);
