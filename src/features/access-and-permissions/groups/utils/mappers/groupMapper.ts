import type { Group } from '../../models';

export const mapGroupData = (apiGroup: Group): Group => {
  return {
    id: apiGroup.id,
    name: apiGroup.name,
    description: apiGroup.description,
    categoryID: apiGroup.categoryID || '',
    creationDate: apiGroup.creationDate || new Date().toISOString(),
  };
};

export const mapGroupsData = (apiGroups: Group[]): Group[] => {
  return apiGroups.map(mapGroupData);
};
