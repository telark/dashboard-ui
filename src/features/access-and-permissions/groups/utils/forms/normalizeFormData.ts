import type { GroupFormData } from '../../models';

export const normalizeGroupFormData = (values: Record<string, unknown>): GroupFormData => {
  return {
    ...(values as GroupFormData),
    userRefs: Array.isArray(values.userRefs) ? values.userRefs : [],
  };
};
