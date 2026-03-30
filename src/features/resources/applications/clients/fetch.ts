import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES } from '../../../../constants';
import type { ResourceDetailsResponse, ResourceListResponse } from '../../../../interfaces/http';
import type { Application, ApplicationUpdatePayload } from '../models';
import { APPLICATIONS_ERROR_MESSAGES } from '../constants';

const SNAPSHOT_SCOPE_APPS = 'apps';

export const fetchApplications = async (silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};

    return await Client<ResourceListResponse<Application>>(
      exporterApiClient,
      Endpoints.APPLICATIONS.GET_ALL.path,
      config,
    );
  } catch (error) {
    if (!silent) {
      logger.error(APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_APPLICATIONS_FAILED, error);
    }
    throw error;
  }
};

export const fetchApplicationDetails = async (name: string) => {
  try {
    return await Client<ResourceDetailsResponse<Application>>(
      exporterApiClient,
      Endpoints.APPLICATIONS.GET_DETAILS(name).path,
    );
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_APPLICATION_DETAILS_FAILED} "${name}":`,
      error,
    );
    throw error;
  }
};

export const updateApplication = async (name: string, payload: ApplicationUpdatePayload) => {
  try {
    return await Client<ResourceDetailsResponse<Application>>(
      exporterApiClient,
      Endpoints.APPLICATIONS.UPDATE(name).path,
      {
        method: 'PATCH',
        data: payload,
      },
    );
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.UPDATE_APPLICATION_FAILED} "${name}":`,
      error,
    );
    throw error;
  }
};

export const deleteApplication = async (name: string) => {
  try {
    return await Client<ResourceDetailsResponse<unknown>>(
      exporterApiClient,
      Endpoints.APPLICATIONS.DELETE(name).path,
      {
        method: 'DELETE',
      },
    );
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.DELETE_APPLICATION_FAILED} "${name}":`,
      error,
    );
    throw error;
  }
};

export interface SnapshotByIdResponse {
  id: string;
  scope: string;
  namespace: string;
  generation: number;
  fileSize: string;
  pvcAvailable: string;
  pvcTotal: string;
  pvcUsedPercent: string;
}

export const getSnapshotsByApplicationId = async (applicationId: string) => {
  try {
    // exporter-service exposes `GET snapshots/{id}/get?scope=apps[&namespace=...&generation=...]`
    const path = `${Endpoints.SNAPSHOTS.GET_BY_ID(applicationId).path}?scope=${encodeURIComponent(
      SNAPSHOT_SCOPE_APPS,
    )}`;
    const resp = await Client<ResourceDetailsResponse<SnapshotByIdResponse>>(
      exporterApiClient,
      path,
    );
    const d = resp.data;
    // We only have a single snapshot payload per call; represent as a compact list in UI.
    return [
      {
        id: d.id,
        scope: d.scope,
        namespace: d.namespace,
        generation: d.generation,
        size: d.fileSize,
        consumed: d.pvcUsedPercent,
        pvcTotal: d.pvcTotal,
        pvcAvailable: d.pvcAvailable,
      },
    ];
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_APPLICATION_SNAPSHOTS_FAILED} "${applicationId}":`,
      error,
    );
    throw error;
  }
};

export const getSnapshotManifest = async (snapshotId: string) => {
  try {
    const path = `${Endpoints.SNAPSHOTS.GET_MANIFEST(snapshotId).path}?scope=${encodeURIComponent(
      SNAPSHOT_SCOPE_APPS,
    )}`;
    // manifest endpoint returns raw JSON, not ResourceDetailsResponse
    return await Client<unknown>(exporterApiClient, path);
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_SNAPSHOT_MANIFEST_FAILED} "${snapshotId}":`,
      error,
    );
    throw error;
  }
};
