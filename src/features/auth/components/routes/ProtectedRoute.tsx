import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hasSessionToken } from '../../utils';
import {
  selectPermissionsError,
  selectPermissionsLoading,
  selectPermissionsReady,
} from '../../store/selectors/permissionsSelectors';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import { FancySpinner } from '../../../../components/animation';
import { DataViewError } from '../../../../components/shared';
import { useLoadingTimeout } from '../../../../hooks/layout/useLoadingTimeout';
import { userFacingMessage } from '../../../../api';
import { DATA_VIEW_ERROR_CONSTANTS } from '../../../../components/shared/dataViewError.constants';
import type { AppDispatch } from '../../../../store';
import { APP_ROUTES, DEFAULT_COLORS, HEADER_LAYOUT } from '../../../../constants';
import { PERMISSION_GATE_BYPASS_PATHS } from '../../constants';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const buildMessage = (error: string | null, timedOut: boolean): string => {
  if (timedOut) return DATA_VIEW_ERROR_CONSTANTS.LABELS.TIMEOUT_MESSAGE;
  if (!error) return DATA_VIEW_ERROR_CONSTANTS.LABELS.GENERIC_MESSAGE;
  try {
    return userFacingMessage(new Error(error));
  } catch {
    return DATA_VIEW_ERROR_CONSTANTS.LABELS.GENERIC_MESSAGE;
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const isAuthenticated = hasSessionToken();
  const permissionsReady = useSelector(selectPermissionsReady);
  const permissionsLoading = useSelector(selectPermissionsLoading);
  const permissionsError = useSelector(selectPermissionsError);
  const bypassGate = PERMISSION_GATE_BYPASS_PATHS.includes(location.pathname);
  const timedOut = useLoadingTimeout({
    isLoading: !permissionsReady && !permissionsError,
    hasError: Boolean(permissionsError),
    hasData: permissionsReady,
  });

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (bypassGate || permissionsReady) {
    return children;
  }

  if (permissionsError || timedOut) {
    const handleRetry = (): void => {
      void dispatch(fetchMyPermissionsThunk());
    };
    return (
      <div
        style={{
          display: 'flex',
          flex: 1,
          width: '100%',
          height: HEADER_LAYOUT.MIN_HEIGHT,
          minHeight: HEADER_LAYOUT.MIN_HEIGHT,
          background: DEFAULT_COLORS.PAGE_BG,
          boxSizing: 'border-box',
        }}
      >
        <DataViewError
          variant="fullPage"
          message={buildMessage(permissionsError, timedOut)}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (permissionsLoading || !permissionsReady) {
    return (
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: HEADER_LAYOUT.MIN_HEIGHT,
          minHeight: HEADER_LAYOUT.MIN_HEIGHT,
          background: DEFAULT_COLORS.PAGE_BG,
          boxSizing: 'border-box',
        }}
      >
        <FancySpinner showLabel={false} size={32} />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
