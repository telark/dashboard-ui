import { Client, exporterApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type {
  SessionDetailsResponse,
  DeleteSessionResponse,
  ListSessionsResponse,
} from '../models/session';

export const getSessionsList = async (userId: string): Promise<ListSessionsResponse> => {
  const { path, method } = Endpoints.SESSIONS.GET_ALL_BY_USER(userId);
  return await Client<ListSessionsResponse>(exporterApiClient, path, { method });
};

export const getSessionDetails = async (sessionToken: string): Promise<SessionDetailsResponse> => {
  const { path, method } = Endpoints.SESSIONS.GET_BY_TOKEN(sessionToken);
  return await Client<SessionDetailsResponse>(exporterApiClient, path, {
    method,
  });
};

// Accepts either a session token or a session resource name.
export const deleteSession = async (sessionRef: string): Promise<DeleteSessionResponse> => {
  const { path, method } = Endpoints.SESSIONS.DELETE_BY_TOKEN(sessionRef);
  return await Client<DeleteSessionResponse>(exporterApiClient, path, {
    method,
  });
};
