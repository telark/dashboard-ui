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
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await fetchBridgeDetails(name);
      return mapSingleBridgeData(response.data);
    } catch (error) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_BRIDGE_DETAILS, error);
      return rejectWithValue(STORE_ERRORS.FETCH_BRIDGE_DETAILS);
    }
  },
);

