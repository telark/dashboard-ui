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

// The current session is addressed as "self": the token travels only in the
// header, never in a URL that proxies and access logs would keep.
export const getCurrentSession = async (): Promise<SessionDetailsResponse> => {
  const { path, method } = Endpoints.SESSIONS.GET_SELF;
  return await Client<SessionDetailsResponse>(exporterApiClient, path, {
    method,
  });
};

export const deleteCurrentSession = async (): Promise<DeleteSessionResponse> => {
  const { path, method } = Endpoints.SESSIONS.DELETE_SELF;
  return await Client<DeleteSessionResponse>(exporterApiClient, path, {
    method,
  });
};

export const deleteSessionByName = async (name: string): Promise<DeleteSessionResponse> => {
  const { path, method } = Endpoints.SESSIONS.DELETE_BY_NAME(name);
  return await Client<DeleteSessionResponse>(exporterApiClient, path, {
    method,
  });
};
