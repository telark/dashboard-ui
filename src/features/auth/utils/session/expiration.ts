import { useEffect, useRef } from 'react';
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
  const lastErrorSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || isAuthRoute) {
      return;
    }

    const errorSignature = (error: unknown): string => {
      if (error instanceof Error) return `${error.name}:${error.message}`;
      return String(error);
    };

    const checkSessionExpiration = async () => {
      try {
        const validationResult = await validateSession();
        if (validationResult.isExpired) {
          onSessionExpired();
        }
        lastErrorSignatureRef.current = null;
      } catch (error) {
        const axiosError = error as { normalized?: { status: number } };
        const isSessionExpiredError =
          axiosError.normalized?.status === HTTP_STATUS.GONE ||
          (error as { response?: { status: number } })?.response?.status === HTTP_STATUS.GONE;
        if (isSessionExpiredError || !isDevelopment()) {
          return;
        }
        const signature = errorSignature(error);
        if (signature === lastErrorSignatureRef.current) return;
        lastErrorSignatureRef.current = signature;
        logger.error('Error checking session expiration:', error);
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
