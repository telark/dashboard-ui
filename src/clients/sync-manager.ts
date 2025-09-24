import { Client, syncManagerApiClient } from '../api';
import { Endpoints } from '../constants/endpoints';

export const triggerGroupersSync = async () => {
  const { path, method } = Endpoints.SYNC.GROUPERS;
  return Client<any>(syncManagerApiClient, path, { method });
};


