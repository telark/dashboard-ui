import { createAsyncThunk } from '@reduxjs/toolkit';
import logger from '../../../../../logging';
import {
  deleteApplication,
  fetchApplications,
  fetchApplicationDetails,
  getApplicationSnapshotSummaries,
  getSnapshotManifest,
  updateApplication,
} from '../../clients';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import { mapApplicationsData, mapSingleApplicationData } from '../../utils/mappers/applicationMapper';
import type { ApplicationSnapshot, ApplicationUpdatePayload } from '../../models';

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

export interface FetchApplicationSnapshotsPayload {
  applicationId: string;
  /** From CR `spec.snapshots`: one GET per item with namespace+generation query params. */
  snapshotRefs?: ApplicationSnapshot[];
}

export const fetchApplicationSnapshotsThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.FETCH_SNAPSHOTS,
  async (payload: FetchApplicationSnapshotsPayload, { rejectWithValue }) => {
    try {
      return await getApplicationSnapshotSummaries(payload.applicationId, payload.snapshotRefs);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_APPLICATION_SNAPSHOTS, error);
      return rejectWithValue(
        extractErrorMessage(error, STORE_ERRORS.FETCH_APPLICATION_SNAPSHOTS),
      );
    }
  },
);

export interface FetchSnapshotManifestPayload {
  manifestKey: string;
  applicationId: string;
  namespace: string;
  generation: number;
}

export const fetchSnapshotManifestThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.FETCH_SNAPSHOT_MANIFEST,
  async (payload: FetchSnapshotManifestPayload, { rejectWithValue }) => {
    try {
      const data = await getSnapshotManifest(payload.applicationId, {
        namespace: payload.namespace,
        generation: payload.generation,
      });
      return { manifestKey: payload.manifestKey, data };
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_SNAPSHOT_MANIFEST, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_SNAPSHOT_MANIFEST));
    }
  },
);

