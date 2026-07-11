import { Client, discoveryApiClient } from '../../../../api';
import { Endpoints, HTTP_HEADERS } from '../../../../constants';
import logger from '../../../../logging';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Application, ApplicationRollbackTriggerPayload } from '../models';
import { APPLICATIONS_ERROR_MESSAGES } from '../constants';

export const triggerApplicationRollback = async (
  name: string,
  payload: ApplicationRollbackTriggerPayload,
) => {
  try {
    return await Client<ResourceDetailsResponse<Application>>(
      discoveryApiClient,
      Endpoints.APPLICATIONS.TRIGGER_ROLLBACK(name).path,
      {
        method: 'POST',
        data: payload,
      },
    );
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.TRIGGER_APPLICATION_ROLLBACK_FAILED} "${name}":`,
      error,
    );
    throw error;
  }
};

export const abortApplicationRollback = async (
  name: string,
  rollbackId: string,
  userID: string,
) => {
  try {
    return await Client<ResourceDetailsResponse<Application>>(
      discoveryApiClient,
      Endpoints.APPLICATIONS.ABORT_ROLLBACK(name, rollbackId).path,
      {
        method: 'POST',
        headers: { [HTTP_HEADERS.CUSTOM.USER_ID]: userID },
      },
    );
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.ABORT_APPLICATION_ROLLBACK_FAILED} "${name}" / "${rollbackId}":`,
      error,
    );
    throw error;
  }
};
