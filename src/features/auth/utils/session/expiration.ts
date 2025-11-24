import { useEffect } from 'react';
import { validateSession } from './validation';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { AUTH_CONFIG } from '../../constants/config';
import { HTTP_STATUS } from '../../../../constants';

export interface UseSessionExpirationCheckOptions {
  isAuthenticated: boolean;
  isAuthRoute: boolean;
  onSessionExpired: () => void;
}

export const useSessionExpirationCheck = ({
  isAuthenticated,
  isAuthRoute,
  onSessionExpired,
}: UseSessionExpirationCheckOptions): void => {
  useEffect(() => {
    if (!isAuthenticated || isAuthRoute) {
      return;
    }

    const checkSessionExpiration = async () => {
      try {
        const validationResult = await validateSession();
        if (validationResult.isExpired) {
          onSessionExpired();
        }
      } catch (error) {
        // Only log unexpected errors, not session expiration (410) responses
        const axiosError = error as { normalized?: { status: number } };
        const isSessionExpiredError =
          axiosError.normalized?.status === HTTP_STATUS.GONE ||
          (error as { response?: { status: number } })?.response?.status === HTTP_STATUS.GONE;
        if (!isSessionExpiredError && isDevelopment()) {
          logger.error('Error checking session expiration:', error);
        }
      }
    };

    // Run initial check
    checkSessionExpiration();

    // Set up interval for background checking
    const intervalId = globalThis.setInterval(
      checkSessionExpiration,
      AUTH_CONFIG.SESSION.VALIDATION.INTERVAL_SECONDS * 1000,
    );

    // Cleanup interval on unmount or when dependencies change
    return () => {
      globalThis.clearInterval(intervalId);
    };
  }, [isAuthenticated, isAuthRoute, onSessionExpired]);
};
