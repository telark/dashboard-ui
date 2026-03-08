import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Role, RoleFormData } from '../models';
import { ROLES_ERROR_MESSAGES } from '../constants';
import { getCurrentUser } from '../../../../features/auth/utils';

export const createRole = async (role: RoleFormData) => {
  try {
    const currentUser = getCurrentUser();
    const roleData: RoleFormData & { createdBy?: string } = {
      name: role.name,
      description: role.description,
      type: role.type,
      categoryID: role.categoryID,
      scopesAndPermissions: role.scopesAndPermissions,
      protection: role.protection,
      status: role.status,
      validity: role.validity,
      assignedTo: role.assignedTo,
    };

    if (currentUser?.id) {
      roleData.createdBy = currentUser.id;
    }

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
