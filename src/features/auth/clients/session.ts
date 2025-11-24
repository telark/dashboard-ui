import { Client, exporterApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type {
  SessionDetailsResponse,
  DeleteSessionResponse,
} from '../models/session';

export const getSessionDetails = async (sessionToken: string): Promise<SessionDetailsResponse> => {
  const { path, method } = Endpoints.SESSIONS.GET_BY_TOKEN(sessionToken);
  return await Client<SessionDetailsResponse>(exporterApiClient, path, {
    method,
  });
};

export const deleteSession = async (sessionToken: string): Promise<DeleteSessionResponse> => {
  const { path, method } = Endpoints.SESSIONS.DELETE_BY_TOKEN(sessionToken);
  return await Client<DeleteSessionResponse>(exporterApiClient, path, {
    method,
  });
};

