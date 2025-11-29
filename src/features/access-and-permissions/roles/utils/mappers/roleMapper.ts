import type { Role } from '../../models';
import type { ResourceDetailsResponse } from '../../../../../interfaces/http';

export const mapRoleData = (apiRole: Role): Role => {
  return {
    id: apiRole.id,
    name: apiRole.name,
    type: apiRole.type,
    scopesAndPermissions: apiRole.scopesAndPermissions || [],
    status: apiRole.status,
    creationDate: apiRole.creationDate || new Date().toISOString(),
    lastUpdateDate: apiRole.lastUpdateDate,
    assignedTo: apiRole.assignedTo,
  };
};

export const mapRolesData = (apiRoles: Role[]): Role[] => {
  return apiRoles.map(mapRoleData);
};

export const mapRoleDetailsData = (response: ResourceDetailsResponse<Role>): Role => {
  return mapRoleData(response.data as any);
};
