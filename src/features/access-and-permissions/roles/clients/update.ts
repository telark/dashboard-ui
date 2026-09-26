import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Role, RoleFormData } from '../models';
import { ROLES_ERROR_MESSAGES } from '../constants';
import { getCurrentUser } from '../../../../features/auth/utils';

export const updateRole = async (roleId: string, role: Partial<RoleFormData>) => {
  try {
    const currentUser = getCurrentUser();
    const roleData: Partial<RoleFormData> & { lastUpdatedBy?: string } = {};
    if (role.name !== undefined) roleData.name = role.name;
    if (role.description !== undefined) roleData.description = role.description;
    if (role.type !== undefined) roleData.type = role.type;
    if (role.categoryID !== undefined) roleData.categoryID = role.categoryID;
    if (role.scopesAndPermissions !== undefined)
      roleData.scopesAndPermissions = role.scopesAndPermissions;
    if (role.protection !== undefined) roleData.protection = role.protection;
    if (role.validity !== undefined) roleData.validity = role.validity;
    if (role.status !== undefined) roleData.status = role.status;

    if (currentUser?.id) {
      roleData.lastUpdatedBy = currentUser.id;
    }

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
