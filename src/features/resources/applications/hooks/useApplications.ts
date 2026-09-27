import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';
import { setSearchValue } from '../store/slices/applicationsSlice';
import type { Application } from '../models';

export function useApplications() {
  const dispatch: AppDispatch = useDispatch();
  const searchValue = useSelector((s: RootState) => s.applications.searchValue);

  const onSearchChange = useCallback(
    (value: string) => {
      dispatch(setSearchValue(value));
    },
    [dispatch],
  );

  return {
    searchValue,
    onSearchChange,
  };
}

export function filterApplications(applications: Application[], searchValue: string) {
  const lower = searchValue.trim().toLowerCase();
  if (!lower) return applications;
  return applications.filter((a) => {
    return (
      a.name.toLowerCase().includes(lower) ||
      a.displayName.toLowerCase().includes(lower) ||
      a.health?.status?.toLowerCase().includes(lower)
    );
  });
}
