export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  GONE: 410,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const ERROR_CODES = {
  NETWORK: 'ERR_NETWORK',
  TIMEOUT: 'ECONNABORTED',
} as const;

// The `code` auth sends with a refusal: match on it, never on the message wording.
export const AUTH_REFUSAL_CODES = {
  ACCOUNT_SUSPENDED: 'account_suspended',
  BOOTSTRAP_PASSKEY_ONLY: 'bootstrap_passkey_only',
  USER_NOT_FOUND: 'user_not_found',
  ENROLL_LINK_RECOVERY: 'enroll_link_recovery',
} as const;
