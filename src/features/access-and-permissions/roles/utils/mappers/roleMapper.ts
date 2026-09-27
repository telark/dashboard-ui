import type { Role } from '../../models';
import type { ResourceDetailsResponse } from '../../../../../interfaces/http';

export const mapRoleData = (apiRole: Role): Role => {
  return {
    id: apiRole.id,
    name: apiRole.name,
    description: apiRole.description || '',
    version: apiRole.version || 'v1.0.0',
    type: apiRole.type,
    priority: apiRole.priority || 0,
    categoryRef: apiRole.categoryRef || '',
    scopesAndPermissions: apiRole.scopesAndPermissions || [],
    protection: apiRole.protection,
    status: apiRole.status,
    validity: apiRole.validity,
    creationDate: apiRole.creationDate || new Date().toISOString(),
    lastUpdateDate: apiRole.lastUpdateDate,
    createdBy: apiRole.createdBy,
    lastUpdatedBy: apiRole.lastUpdatedBy,
    deprecatedAt: apiRole.deprecatedAt,
    deletedAt: apiRole.deletedAt,
  };
};

export const mapRolesData = (apiRoles: Role[]): Role[] => {
  return apiRoles.map(mapRoleData);
};

export const mapRoleDetailsData = (response: ResourceDetailsResponse<Role>): Role => {
  return mapRoleData(response.data);
};
