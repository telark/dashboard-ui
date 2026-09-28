import { createAsyncThunk } from '@reduxjs/toolkit';
import logger, { logErrorOnce } from '../../../../logging';
import {
  abortApplicationRollback,
  resetApplication,
  fetchApplications,
  fetchApplicationDetails,
  getApplicationSnapshotSummaries,
  getSnapshotManifest,
  triggerApplicationRollback,
  updateApplication,
} from '../../clients';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../constants/store/store';
import {
  mapApplicationsData,
  mapSingleApplicationData,
} from '../../utils/mappers/applicationMapper';
import type { Application, ApplicationSnapshot, ApplicationUpdatePayload } from '../../models';

export const fetchAllApplicationsThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const raw = await fetchApplications();
      return mapApplicationsData(raw);
    } catch (error: unknown) {
      logErrorOnce('applications/fetchAll', STORE_MESSAGES.ERROR_FETCHING_APPLICATIONS, error);
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
      logErrorOnce(
        `applications/fetchDetails:${name}`,
        STORE_MESSAGES.ERROR_FETCHING_APPLICATION_DETAILS,
        error,
      );
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

export const resetApplicationThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.RESET,
  async (name: string, { rejectWithValue }) => {
    try {
      await resetApplication(name);
      return name;
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DELETING_APPLICATION, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.RESET_APPLICATION));
    }
  },
);

export interface FetchApplicationSnapshotsPayload {
  /** From CR `spec.snapshots`: one GET per item with namespace+generation query params. */
  snapshotRefs?: ApplicationSnapshot[];
  canReadFiles: boolean;
}

export const fetchApplicationSnapshotsThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.FETCH_SNAPSHOTS,
  async (payload: FetchApplicationSnapshotsPayload, { rejectWithValue }) => {
    try {
      return await getApplicationSnapshotSummaries(payload.snapshotRefs, payload.canReadFiles);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_APPLICATION_SNAPSHOTS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_APPLICATION_SNAPSHOTS));
    }
  },
);

export interface FetchSnapshotManifestPayload {
  manifestKey: string;
  snapshotId: string;
  namespace: string;
  generation: number;
}

export const fetchSnapshotManifestThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.FETCH_SNAPSHOT_MANIFEST,
  async (payload: FetchSnapshotManifestPayload, { rejectWithValue }) => {
    try {
      const data = await getSnapshotManifest(payload.snapshotId, {
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

export interface TriggerApplicationRollbackArgs {
  name: string;
  snapshotGeneration: number;
  triggeredBy: string;
}

export const triggerApplicationRollbackThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.TRIGGER_ROLLBACK,
  async (
    { name, snapshotGeneration, triggeredBy }: TriggerApplicationRollbackArgs,
    { rejectWithValue },
  ) => {
    try {
      const response = await triggerApplicationRollback(name, {
        snapshotGeneration,
        triggeredBy,
      });
      const raw = response.data;
      if (raw != null && typeof raw === 'object' && typeof (raw as Application).name === 'string') {
        return mapSingleApplicationData(raw);
      }
      const refreshed = await fetchApplicationDetails(name);
      return mapSingleApplicationData(refreshed.data);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_TRIGGERING_APPLICATION_ROLLBACK, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.TRIGGER_APPLICATION_ROLLBACK));
    }
  },
);

export interface AbortApplicationRollbackArgs {
  name: string;
  rollbackId: string;
}

export const abortApplicationRollbackThunk = createAsyncThunk(
  STORE_ACTIONS.APPLICATIONS.ABORT_ROLLBACK,
  async ({ name, rollbackId }: AbortApplicationRollbackArgs, { rejectWithValue }) => {
    try {
      const response = await abortApplicationRollback(name, rollbackId);
      const raw = response.data;
      if (raw != null && typeof raw === 'object' && typeof (raw as Application).name === 'string') {
        return mapSingleApplicationData(raw);
      }
      const refreshed = await fetchApplicationDetails(name);
      return mapSingleApplicationData(refreshed.data);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_ABORTING_APPLICATION_ROLLBACK, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.ABORT_APPLICATION_ROLLBACK));
    }
  },
);
