import { Client, exporterApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import logger from '../../../../logging';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { ApplicationRollbackEntry } from '../models';
import { APPLICATIONS_ERROR_MESSAGES } from '../constants';

export const fetchApplicationRollbacks = async (name: string) => {
  try {
    return await Client<ResourceDetailsResponse<ApplicationRollbackEntry[]>>(
      exporterApiClient,
      Endpoints.APPLICATIONS.GET_ROLLBACKS(name).path,
      { method: Endpoints.APPLICATIONS.GET_ROLLBACKS(name).method },
    );
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_APPLICATION_DETAILS_FAILED} "${name}" rollbacks:`,
      error,
    );
    throw error;
  }
};
