import { STORAGE_KEYS } from '../../constants/store/store';

export type ResourceType = 'grouper' | 'workload' | 'bridge';

const getResourceTabKey = (resourceType: ResourceType, resourceName: string): string => {
  return `${STORAGE_KEYS.RESOURCE_ACTIVE_TAB}_${resourceType}_${resourceName}`;
};

export const getPersistedResourceTab = <T extends string>(
  resourceType: ResourceType,
  resourceName: string,
  defaultTab: T,
  validTabs: readonly T[],
): T => {
  if (!resourceName || !resourceType) {
    return defaultTab;
  }

  try {
    const stored = localStorage.getItem(getResourceTabKey(resourceType, resourceName));
    if (stored) {
      if (validTabs.includes(stored as T)) {
        return stored as T;
      }
    }
  } catch {
    // If localStorage is unavailable or there's an error, return default
  }

  return defaultTab;
};

export const persistResourceTab = (
  resourceType: ResourceType,
  resourceName: string,
  tabKey: string,
): void => {
  if (!resourceName || !resourceType || !tabKey) {
    return;
  }

  try {
    localStorage.setItem(getResourceTabKey(resourceType, resourceName), tabKey);
  } catch {
    // Ignore persistence errors (e.g., localStorage quota exceeded)
  }
};

