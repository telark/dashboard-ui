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

export const fetchAllBridgesThunk = createAsyncThunk(
  STORE_ACTIONS.BRIDGES.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const rawBridgesData = await fetchBridges();
      return mapBridgesData(rawBridgesData);
    } catch (error: any) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_BRIDGES, error);
      return rejectWithValue(error.message || STORE_ERRORS.FETCH_BRIDGES);
    }
  },
);

export const fetchAllBridgesSilentThunk = createAsyncThunk(
  STORE_ACTIONS.BRIDGES.FETCH_SILENT,
  async (_, { rejectWithValue }) => {
    try {
      const rawBridgesData = await fetchBridges(true); // Silent mode
      return mapBridgesData(rawBridgesData);
    } catch (error: any) {
      // Don't log errors during retry attempts
      return rejectWithValue(error.message || STORE_ERRORS.FETCH_BRIDGES);
    }
  },
);

export const fetchBridgeDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.BRIDGES.FETCH_DETAILS,
  async (name: string, { rejectWithValue, getState, dispatch }) => {
    try {
      // Look up the bridge from the list to get its syncName (API-facing name)
      const state = getState() as any;
      let bridge = state.bridge.bridges.find((b: any) => b.name === name);
      
      // If bridge not found in store (e.g., on page refresh), fetch the list first
      if (!bridge && state.bridge.bridges.length === 0) {
        try {
          await dispatch(fetchAllBridgesSilentThunk()).unwrap();
          // Re-fetch state after loading bridges
          const updatedState = (getState() as any);
          bridge = updatedState.bridge.bridges.find((b: any) => b.name === name);
        } catch (fetchError) {
          // If fetching list fails, proceed with name directly
          console.warn('Failed to fetch bridges list, using name directly:', fetchError);
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

