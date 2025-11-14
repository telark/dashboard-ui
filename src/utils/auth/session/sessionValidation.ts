import { getSessionToken } from '../session';
import { getSessionDetails } from '../../../clients/exporter';
import { isDevelopment } from '../../helpers/env';
import logger from '../../../logging';
import { AUTH_CONSTANTS } from '../../../constants/auth/messages';
import { HTTP_STATUS } from '../../../constants';
import type { AxiosError } from 'axios';

export interface SessionValidationResult {
  isValid: boolean;
  isExpired: boolean;
  sessionDetails?: {
    createdTimestamp: string;
    expiresTimestamp: string;
    sessionToken: string;
    userId: string;
  };
  error?: string;
}

export const isSessionExpired = (expiresTimestamp: string): boolean => {
  try {
    const expiresDate = new Date(expiresTimestamp);
    const now = new Date();
    return now >= expiresDate;
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

    const response = await getSessionDetails(sessionToken);
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

    // Check if the error is a 410 Gone (session expired) response
    const status =
      axiosError.normalized?.status || axiosError.response?.status || (error as any)?.status;
    const isExpiredStatus = status === HTTP_STATUS.GONE;
    const errorMessage =
      axiosError.normalized?.message || axiosError.message || (error as any)?.message || '';
    const isExpiredMessage =
      errorMessage.toLowerCase().includes('session') &&
      errorMessage.toLowerCase().includes('expired');

    if (isExpiredStatus || isExpiredMessage) {
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

