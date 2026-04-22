import type { AppDispatch } from '../../../../../store';
import {
  fetchAllApplicationsThunk,
  fetchAllApplicationsSilentThunk,
} from '../../store/thunks/fetchThunks';

export const loadApplications = async (dispatch: AppDispatch) => {
  const result = await dispatch(fetchAllApplicationsThunk());
  return fetchAllApplicationsThunk.fulfilled.match(result);
};

export const loadApplicationsSilent = async (dispatch: AppDispatch) => {
  const result = await dispatch(fetchAllApplicationsSilentThunk());
  return fetchAllApplicationsSilentThunk.fulfilled.match(result);
};
