import type { GroupFormData } from '../../models';

export const normalizeGroupFormData = (values: Record<string, unknown>): GroupFormData => {
  return {
    ...(values as GroupFormData),
    assignedUsersIDs: Array.isArray(values.assignedUsersIDs) ? values.assignedUsersIDs : [],
  };
};
