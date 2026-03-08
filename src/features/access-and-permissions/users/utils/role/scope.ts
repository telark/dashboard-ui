import { ROLES_CONSTANTS as RC } from '../../../roles/constants';

export const getScopeLabel = (scopeKey: string): string => {
  const area = RC.SCOPE.DEFAULT_AREAS.find((a) => a.key === scopeKey);
  return area?.label || scopeKey;
};
