import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasSessionToken } from '../../utils';
import { APP_ROUTES } from '../../../../constants';
import type { PermissionLevel } from '../../models';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredScope?: string;
  minimumLevel?: PermissionLevel;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = hasSessionToken();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
