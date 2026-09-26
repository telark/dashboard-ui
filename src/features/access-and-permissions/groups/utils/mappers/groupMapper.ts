import type { Group } from '../../models';
import type { ResourceDetailsResponse } from '../../../../../interfaces/http';

export const mapGroupData = (apiGroup: Group): Group => {
  return {
    id: apiGroup.id,
    userRefs: apiGroup.userRefs || [],
    roleRefs: apiGroup.roleRefs || [],
    name: apiGroup.name,
    description: apiGroup.description,
    categoryRef: apiGroup.categoryRef || '',
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
