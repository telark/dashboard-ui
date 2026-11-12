import { useEffect, useRef } from 'react';
import { validateSession } from './validation';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { AUTH_CONFIG } from '../../constants/config';
import { ACCOUNT_SUSPENDED_EVENT, HTTP_STATUS, SESSION_CHECK_EVENT } from '../../../../constants';

export interface UseSessionExpirationCheckOptions {
  isAuthenticated: boolean;
  isAuthRoute: boolean;
  onSessionExpired: (duplicateCookie: boolean) => void;
  onAccountSuspended: () => void;
}

export const useSessionExpirationCheck = ({
  isAuthenticated,
  isAuthRoute,
  onSessionExpired,
  onAccountSuspended,
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

    const onCheckError = (error: unknown): void => {
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
    };

    const checkSessionExpiration = (): void => {
      validateSession()
        .then((validationResult) => {
          if (validationResult.isExpired) {
            onSessionExpired(validationResult.duplicateCookie === true);
          }
          lastErrorSignatureRef.current = null;
        })
        .catch(onCheckError);
    };

    checkSessionExpiration();

    const intervalId = globalThis.setInterval(
      checkSessionExpiration,
      AUTH_CONFIG.SESSION.VALIDATION.INTERVAL_SECONDS * 1000,
    );

    // The check's own request goes through the API client, so it raises this event too.
    globalThis.addEventListener(ACCOUNT_SUSPENDED_EVENT, onAccountSuspended);
    // A refused event stream asks for the check now.
    globalThis.addEventListener(SESSION_CHECK_EVENT, checkSessionExpiration);

    return () => {
      globalThis.clearInterval(intervalId);
      globalThis.removeEventListener(ACCOUNT_SUSPENDED_EVENT, onAccountSuspended);
      globalThis.removeEventListener(SESSION_CHECK_EVENT, checkSessionExpiration);
    };
  }, [isAuthenticated, isAuthRoute, onSessionExpired, onAccountSuspended]);
};
