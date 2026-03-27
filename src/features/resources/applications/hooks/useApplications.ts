import { useCallback, useState } from 'react';
import type { Application } from '../models';

export function useApplications() {
  const [searchValue, setSearchValue] = useState('');

  const onSearchChange = useCallback((value: string) => setSearchValue(value), []);

  return {
    searchValue,
    onSearchChange,
  };
}

export function filterApplications(applications: Application[], searchValue: string) {
  if (!searchValue) return applications;
  const lower = searchValue.toLowerCase();
  return applications.filter((a) => {
    return (
      a.name.toLowerCase().includes(lower) ||
      a.displayName.toLowerCase().includes(lower) ||
      a.health?.status?.toLowerCase().includes(lower)
    );
  });
}

