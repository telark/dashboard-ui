import { cfg } from './config.js';

const SESSION_HEADER = 'X-Session-Token';
const USER_ID_HEADER = 'X-User-ID';

export const withSession = (headers = {}) => {
  if (!cfg.sessionToken) return headers;
  return { ...headers, [SESSION_HEADER]: cfg.sessionToken };
};

export const withUser = (headers = {}) => {
  if (!cfg.userId) return headers;
  return { ...headers, [USER_ID_HEADER]: cfg.userId };
};

export const authedHeaders = (extra = {}) => withSession(withUser(extra));
