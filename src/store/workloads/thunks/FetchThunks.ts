import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllAppsWorkloads,
  fetchAllBatchesWorkloads,
  fetchAppWorkloadDetails,
} from '../../../clients/exporter';
import { mapAppsWorkloadsData, mapSingleAppWorkloadData } from '../../../utils/mappers/appMapper';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../constants';
import { extractErrorMessage } from '../../../utils/helpers/format';

export const fetchAllAppsWorkloadsThunk = createAsyncThunk(
  STORE_ACTIONS.WORKLOADS.FETCH_APPS,
  async (_, { rejectWithValue }) => {
    try {
      const rawWorkloadsData = await fetchAllAppsWorkloads();
      return mapAppsWorkloadsData(rawWorkloadsData);
    } catch (error: unknown) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_APPS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_APPS));
    }
  },
);

export const fetchAllBatchesWorkloadsThunk = createAsyncThunk(
  STORE_ACTIONS.WORKLOADS.FETCH_BATCHES,
  async (_, { rejectWithValue }) => {
    try {
      const rawBatchesData = await fetchAllBatchesWorkloads();
      return rawBatchesData.data?.items || [];
    } catch (error: unknown) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_BATCHES, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_BATCHES));
    }
  },
);

export const fetchAppWorkloadDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.WORKLOADS.FETCH_APP_DETAILS,
  async (name: string, { rejectWithValue }) => {
    try {
      const rawWorkloadsData = await fetchAppWorkloadDetails(name);
      return mapSingleAppWorkloadData(rawWorkloadsData.data);
    } catch (error: unknown) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_APP_DETAILS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_APP_DETAILS));
    }
  },
);
