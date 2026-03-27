import type { AppDispatch } from '../../../../../store';
import { fetchAllApplicationsThunk, fetchAllApplicationsSilentThunk } from '../../store/thunks/fetchThunks';

export const loadApplications = async (dispatch: AppDispatch) => {
  await dispatch(fetchAllApplicationsThunk());
  return true;
};

export const loadApplicationsSilent = async (dispatch: AppDispatch) => {
  await dispatch(fetchAllApplicationsSilentThunk());
  return true;
};

