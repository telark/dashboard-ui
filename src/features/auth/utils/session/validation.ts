import { getSessionToken } from './token';
import { getCurrentSession } from '../../clients';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { AUTH_CONSTANTS } from '../../constants/messages';
import { HTTP_STATUS } from '../../../../constants';
import { parseDate } from '../../../../utils/shared/time';
import type { AxiosError } from 'axios';
import type { SessionValidationResult } from '../../models/session';

export const isSessionExpired = (expiresTimestamp: string): boolean => {
  try {
    const expiresDate = parseDate(expiresTimestamp);
    return expiresDate !== null && Date.now() >= expiresDate.getTime();
  } catch (error) {
    if (isDevelopment()) {
      logger.error(AUTH_CONSTANTS.SESSION.VALIDATION.INVALID_TIMESTAMP_ERROR, error);
    }
    return true; // If we can't parse the timestamp, consider it expired for safety
  }
};

export const validateSession = async (): Promise<SessionValidationResult> => {
  try {
    const sessionToken = getSessionToken();
    if (!sessionToken) {
      return {
        isValid: false,
        isExpired: false,
        error: AUTH_CONSTANTS.SESSION.VALIDATION.NO_TOKEN_ERROR,
      };
    }

    const response = await getCurrentSession();
    if (response.status !== 200 || !response.data) {
      return {
        isValid: false,
        isExpired: false,
        error: AUTH_CONSTANTS.SESSION.VALIDATION.FETCH_ERROR,
      };
    }

    const { expiresTimestamp } = response.data;
    const expired = isSessionExpired(expiresTimestamp);

    return {
      isValid: !expired,
      isExpired: expired,
      sessionDetails: response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError & { normalized?: { status: number; message: string } };

    const unknownError = error as { status?: number; message?: string };
    const status =
      axiosError.normalized?.status || axiosError.response?.status || unknownError?.status;
    // 401 = the session was rejected by the API's own check, which is now the
    // usual answer for an expired or unknown token.
    const isExpiredStatus = status === HTTP_STATUS.GONE || status === HTTP_STATUS.UNAUTHORIZED;
    // 404 = session CRD deleted (revoked or logged out from another device) — treat as terminal
    const isDeletedStatus = status === HTTP_STATUS.NOT_FOUND;
    const errorMessage =
      axiosError.normalized?.message || axiosError.message || unknownError?.message || '';
    const isExpiredMessage =
      errorMessage.toLowerCase().includes('session') &&
      errorMessage.toLowerCase().includes('expired');

    if (isExpiredStatus || isDeletedStatus || isExpiredMessage) {
      return {
        isValid: false,
        isExpired: true,
        error: AUTH_CONSTANTS.SESSION.VALIDATION.FETCH_ERROR,
      };
    }

    if (isDevelopment()) {
      logger.error(AUTH_CONSTANTS.SESSION.VALIDATION.VALIDATION_ERROR, error);
    }
    return {
      isValid: false,
      isExpired: false,
      error:
        error instanceof Error ? error.message : AUTH_CONSTANTS.SESSION.VALIDATION.UNKNOWN_ERROR,
    };
  }
};
