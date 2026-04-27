import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasSessionToken } from '../../utils';
import { selectPermissionsReady } from '../../store/selectors/permissionsSelectors';
import { FancySpinner } from '../../../../components/animation';
import { APP_ROUTES } from '../../../../constants';
import { PERMISSION_GATE_BYPASS_PATHS } from '../../constants';
import type { PermissionLevel } from '../../models';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredScope?: string;
  minimumLevel?: PermissionLevel;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = hasSessionToken();
  const permissionsReady = useSelector(selectPermissionsReady);

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const bypassGate = PERMISSION_GATE_BYPASS_PATHS.includes(location.pathname);

  if (!permissionsReady && !bypassGate) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          minHeight: '200px',
        }}
      >
        <FancySpinner showLabel={false} size={24} />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
