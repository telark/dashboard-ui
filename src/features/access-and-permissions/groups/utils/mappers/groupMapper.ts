import type { Group } from '../../models';
import type { ResourceDetailsResponse } from '../../../../../interfaces/http';

export const mapGroupData = (apiGroup: Group): Group => {
  return {
    id: apiGroup.id,
    assignedUsersIDs: apiGroup.assignedUsersIDs || [],
    assignedRolesIDs: apiGroup.assignedRolesIDs || [],
    name: apiGroup.name,
    description: apiGroup.description,
    categoryID: apiGroup.categoryID || '',
    creationDate: apiGroup.creationDate || new Date().toISOString(),
    lastUpdateDate: apiGroup.lastUpdateDate,
    createdBy: apiGroup.createdBy,
    lastUpdatedBy: apiGroup.lastUpdatedBy,
  };
};

export const mapGroupsData = (apiGroups: Group[]): Group[] => {
  return apiGroups.map(mapGroupData);
};

export const mapGroupDetailsData = (response: ResourceDetailsResponse<Group>): Group => {
  return mapGroupData(response.data);
};
