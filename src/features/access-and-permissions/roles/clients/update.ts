import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Role, RoleFormData } from '../models';
import { ROLES_ERROR_MESSAGES } from '../constants';

export const updateRole = async (roleId: string, role: Partial<RoleFormData>) => {
  try {
    const roleData: Partial<RoleFormData> = {};
    if (role.name !== undefined) roleData.name = role.name;
    if (role.type !== undefined) roleData.type = role.type;
    if (role.scopesAndPermissions !== undefined)
      roleData.scopesAndPermissions = role.scopesAndPermissions;
    if (role.status !== undefined) roleData.status = role.status;
    if (role.assignedTo !== undefined) roleData.assignedTo = role.assignedTo;

    return await Client<ResourceDetailsResponse<Role>>(
      exporterApiClient,
      Endpoints.ROLES.PATCH_BY_ID(roleId).path,
      {
        method: Endpoints.ROLES.PATCH_BY_ID(roleId).method,
        data: roleData,
      },
    );
  } catch (error) {
    logger.error(ROLES_ERROR_MESSAGES.CLIENT.UPDATE_ROLE_FAILED(roleId), error);
    throw error;
  }
};
