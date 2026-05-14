import { Client, authApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import { ROLES_ERROR_MESSAGES } from '../constants';

export const deleteRole = async (roleId: string) => {
  try {
    const endpoint = Endpoints.ROLES.CLEANUP(roleId);
    return await Client(authApiClient, endpoint.path, { method: endpoint.method });
  } catch (error) {
    logger.error(ROLES_ERROR_MESSAGES.CLIENT.DELETE_ROLE_FAILED(roleId), error);
    throw error;
  }
};
