import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Role, RoleFormData } from '../models';
import { ROLES_ERROR_MESSAGES } from '../constants';

export const createRole = async (role: RoleFormData) => {
  try {
    const roleData = {
      name: role.name,
      type: role.type,
      scopesAndPermissions: role.scopesAndPermissions,
      status: role.status,
      assignedTo: role.assignedTo,
    };
    return await Client<ResourceDetailsResponse<Role>>(
      exporterApiClient,
      Endpoints.ROLES.CREATE.path,
      {
        method: Endpoints.ROLES.CREATE.method,
        data: roleData,
      },
    );
  } catch (error) {
    logger.error(ROLES_ERROR_MESSAGES.CLIENT.CREATE_ROLE_FAILED(role.name), error);
    throw error;
  }
};
