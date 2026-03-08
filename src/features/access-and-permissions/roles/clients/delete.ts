import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import { ROLES_ERROR_MESSAGES } from '../constants';

export const deleteRole = async (roleId: string) => {
  try {
    return await Client(exporterApiClient, Endpoints.ROLES.DELETE_BY_ID(roleId).path, {
      method: Endpoints.ROLES.DELETE_BY_ID(roleId).method,
    });
  } catch (error) {
    logger.error(ROLES_ERROR_MESSAGES.CLIENT.DELETE_ROLE_FAILED(roleId), error);
    throw error;
  }
};
