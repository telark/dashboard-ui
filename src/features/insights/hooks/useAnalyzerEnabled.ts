import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '../../../logging';
import { selectGlobalConfigState } from '../../globalconfig/store';
import { fetchAnalyzerRuntime } from '../clients/insights';
import { INSIGHTS_ERROR_MESSAGES } from '../constants/errors';

// Whether Insights are on, undefined until known. Without settings read the GlobalConfig is
// unreadable; the analyzer runtime says whether it is on.
export const useAnalyzerEnabled = (): boolean | undefined => {
  const configEnabled = useSelector(selectGlobalConfigState).data?.ai?.enabled;
  const [runtimeEnabled, setRuntimeEnabled] = useState<boolean>();

  useEffect(() => {
    if (configEnabled !== undefined) return undefined;
    let canceled = false;
    fetchAnalyzerRuntime()
      .then((runtime) => !canceled && setRuntimeEnabled(runtime.enabled))
      .catch((error: unknown) =>
        logger.error(INSIGHTS_ERROR_MESSAGES.CLIENT.RUNTIME_FETCH_FAILED, error),
      );
    return () => {
      canceled = true;
    };
  }, [configEnabled]);

  return configEnabled ?? runtimeEnabled;
};
