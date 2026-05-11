import { DATA_VIEW_ERROR_CONSTANTS } from '../../components/shared/dataViewError.constants';
import { useLoadingTimeout } from './useLoadingTimeout';
import { userFacingMessage } from '../../api';

export type DataViewPhase = 'error' | 'loading' | 'empty' | 'ready';

export interface DataViewStateInput {
  loading: boolean;
  error: string | null;
  hasData: boolean;
}

export interface DataViewState {
  phase: DataViewPhase;
  errorMessage: string;
  timedOut: boolean;
}

const messageFromError = (error: string | null, timedOut: boolean): string => {
  if (timedOut) return DATA_VIEW_ERROR_CONSTANTS.LABELS.TIMEOUT_MESSAGE;
  if (!error) return DATA_VIEW_ERROR_CONSTANTS.LABELS.GENERIC_MESSAGE;
  try {
    return userFacingMessage(new Error(error));
  } catch {
    return DATA_VIEW_ERROR_CONSTANTS.LABELS.GENERIC_MESSAGE;
  }
};

export const useDataViewState = ({
  loading,
  error,
  hasData,
}: DataViewStateInput): DataViewState => {
  const timedOut = useLoadingTimeout({ isLoading: loading, hasError: Boolean(error), hasData });

  let phase: DataViewPhase;
  if (error || timedOut) {
    phase = 'error';
  } else if (loading && !hasData) {
    phase = 'loading';
  } else if (!hasData) {
    phase = 'empty';
  } else {
    phase = 'ready';
  }

  return {
    phase,
    errorMessage: messageFromError(error, timedOut),
    timedOut,
  };
};
