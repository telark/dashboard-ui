import { useEffect } from 'react';
import { validateSession } from './sessionValidation';
import { isDevelopment } from '../../helpers/env';
import logger from '../../../logging';
import { AUTH_CONFIG } from '../../../constants/auth/config';

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
          if (isDevelopment()) {
            logger.warn('Session expired:', validationResult);
          }
          onSessionExpired();
        }
      } catch (error) {
        if (isDevelopment()) {
          logger.error('Error checking session expiration:', error);
        }
        // On error, don't show modal - let normal auth flow handle it
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

