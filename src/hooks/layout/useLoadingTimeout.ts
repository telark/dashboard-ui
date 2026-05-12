import { useEffect, useState } from 'react';
import { DATA_VIEW_ERROR_CONSTANTS } from '../../components/shared/dataViewError.constants';

export interface LoadingTimeoutOptions {
  isLoading: boolean;
  hasError: boolean;
  hasData: boolean;
  timeoutMs?: number;
}

export const useLoadingTimeout = ({
  isLoading,
  hasError,
  hasData,
  timeoutMs = DATA_VIEW_ERROR_CONSTANTS.TIMEOUT_MS,
}: LoadingTimeoutOptions): boolean => {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoading || hasError || hasData) {
      return () => setTimedOut(false);
    }
    const id = window.setTimeout(() => setTimedOut(true), timeoutMs);
    return () => {
      window.clearTimeout(id);
      setTimedOut(false);
    };
  }, [isLoading, hasError, hasData, timeoutMs]);

  return timedOut;
};
