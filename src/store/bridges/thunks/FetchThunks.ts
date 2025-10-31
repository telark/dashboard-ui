import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchBridges,
  fetchBridgeDetails,
} from '../../../clients/exporter';
import {
  mapBridgesData,
  mapSingleBridgeData,
} from '../../../utils/mappers/bridgeMapper';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../constants';
import { RootState } from '../../../store';
import { BridgeInterface } from '../../../interfaces/bridge';
import { extractErrorMessage } from '../../../utils/helpers/format';

export const fetchAllBridgesThunk = createAsyncThunk(
  STORE_ACTIONS.BRIDGES.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const rawBridgesData = await fetchBridges();
      return mapBridgesData(rawBridgesData);
    } catch (error: unknown) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_BRIDGES, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_BRIDGES));
    }
  },
);

export const fetchAllBridgesSilentThunk = createAsyncThunk(
  STORE_ACTIONS.BRIDGES.FETCH_SILENT,
  async (_, { rejectWithValue }) => {
    try {
      const rawBridgesData = await fetchBridges(true); // Silent mode
      return mapBridgesData(rawBridgesData);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_BRIDGES));
    }
  },
);

export const fetchBridgeDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.BRIDGES.FETCH_DETAILS,
  async (name: string, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      let bridge = state.bridge.bridges.find((b: BridgeInterface) => b.name === name);
      
      if (!bridge && state.bridge.bridges.length === 0) {
        try {
          await dispatch(fetchAllBridgesSilentThunk()).unwrap();
          const updatedState = getState() as RootState;
          bridge = updatedState.bridge.bridges.find((b: BridgeInterface) => b.name === name);
        } catch (fetchError) {
          console.error(STORE_MESSAGES.ERROR_FETCHING_BRIDGES, fetchError);
        }
      }
      
      const apiName = bridge?.syncName || name;
      
      const response = await fetchBridgeDetails(apiName);
      return mapSingleBridgeData(response.data);
    } catch (error) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_BRIDGE_DETAILS, error);
      return rejectWithValue(STORE_ERRORS.FETCH_BRIDGE_DETAILS);
    }
  },
);

