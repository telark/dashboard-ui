import { Client, syncManagerApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
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
      syncManagerApiClient,
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
