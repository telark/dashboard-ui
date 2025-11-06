import { useState, useEffect, useCallback } from 'react';
import {
  getPersistedResourceTab,
  persistResourceTab,
  type ResourceType,
} from './tabPersistence';

interface UsePersistedTabParams<T extends string> {
  resourceType: ResourceType;
  resourceName: string | undefined;
  tabKeys: Record<string, T>;
  defaultTab: T;
}

export const usePersistedTab = <T extends string>({
  resourceType,
  resourceName,
  tabKeys,
  defaultTab,
}: UsePersistedTabParams<T>) => {
  const validTabs = Object.values(tabKeys) as readonly T[];

  // Initialize activeTab from persisted value or default
  const [activeTab, setActiveTab] = useState<T>(() => {
    return resourceName
      ? getPersistedResourceTab<T>(resourceType, resourceName, defaultTab, validTabs)
      : defaultTab;
  });

  // Update activeTab when resource name changes (e.g., navigating to different resource)
  useEffect(() => {
    if (resourceName) {
      const persistedTab = getPersistedResourceTab<T>(
        resourceType,
        resourceName,
        defaultTab,
        validTabs,
      );
      setActiveTab(persistedTab);
    }
  }, [resourceName, resourceType, defaultTab, validTabs]);

  // Persist tab changes
  const handleTabChange = useCallback(
    (tab: T) => {
      setActiveTab(tab);
      if (resourceName) {
        persistResourceTab(resourceType, resourceName, tab);
      }
    },
    [resourceName, resourceType],
  );

  return {
    activeTab,
    handleTabChange,
  };
};

