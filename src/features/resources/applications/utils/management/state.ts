import type { AppDispatch } from '../../../../../store';
import {
  fetchAllApplicationsThunk,
  fetchAllApplicationsSilentThunk,
} from '../../store/thunks/fetchThunks';
import type { Application } from '../../models';

export const loadApplications = async (dispatch: AppDispatch) => {
  const result = await dispatch(fetchAllApplicationsThunk());
  return fetchAllApplicationsThunk.fulfilled.match(result);
};

export const loadApplicationsSilent = async (dispatch: AppDispatch) => {
  const result = await dispatch(fetchAllApplicationsSilentThunk());
  return fetchAllApplicationsSilentThunk.fulfilled.match(result);
};

export function filterByExcludedNamespaces(apps: Application[], excluded: string[]): Application[] {
  if (excluded.length === 0) return apps;
  const excludedSet = new Set(excluded);
  return apps.filter((a) => {
    const primaryNs = (a.namespaces?.items ?? [])[0]?.name ?? '';
    return primaryNs === '' || !excludedSet.has(primaryNs);
  });
}
