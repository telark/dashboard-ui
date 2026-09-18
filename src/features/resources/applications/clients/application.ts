import { Client, discoveryApiClient, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES } from '../../../../constants';
import type { ResourceDetailsResponse, ResourceListResponse } from '../../../../interfaces/http';
import type { Application, ApplicationUpdatePayload } from '../models';
import { APPLICATIONS_ERROR_MESSAGES } from '../constants';

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
        data: { spec: payload },
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

export const resetApplication = async (name: string) => {
  try {
    return await Client<ResourceDetailsResponse<unknown>>(
      discoveryApiClient,
      Endpoints.APPLICATIONS.RESET(name).path,
      {
        method: 'POST',
      },
    );
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.RESET_APPLICATION_FAILED} "${name}":`,
      error,
    );
    throw error;
  }
};
