import { createAsyncThunk } from '@reduxjs/toolkit';
import logger from '../../../../../logging';
import { deleteApplication, fetchApplications, fetchApplicationDetails, updateApplication } from '../../clients';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import { mapApplicationsData, mapSingleApplicationData } from '../../utils/mappers/applicationMapper';
import type { ApplicationUpdatePayload } from '../../models';

export const fetchAllApplicationsThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const raw = await fetchApplications();
      return mapApplicationsData(raw);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_APPLICATIONS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_APPLICATIONS));
    }
  },
);

export const fetchAllApplicationsSilentThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.FETCH_SILENT,
  async (_, { rejectWithValue }) => {
    try {
      const raw = await fetchApplications(true);
      return mapApplicationsData(raw);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_APPLICATIONS));
    }
  },
);

export const fetchApplicationDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.FETCH_DETAILS,
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await fetchApplicationDetails(name);
      return mapSingleApplicationData(response.data);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_APPLICATION_DETAILS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_APPLICATION_DETAILS));
    }
  },
);

export const updateApplicationThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.UPDATE,
  async (
    { name, payload }: { name: string; payload: ApplicationUpdatePayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateApplication(name, payload);
      return mapSingleApplicationData(response.data);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_UPDATING_APPLICATION, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_APPLICATION));
    }
  },
);

export const deleteApplicationThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.DELETE,
  async (name: string, { rejectWithValue }) => {
    try {
      await deleteApplication(name);
      return name;
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DELETING_APPLICATION, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DELETE_APPLICATION));
    }
  },
);

