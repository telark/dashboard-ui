import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasSessionToken } from '../../utils';
import { useHasPermission } from '../../hooks';
import { APP_ROUTES } from '../../../../constants';
import type { PermissionLevel } from '../../models';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredScope?: string;
  minimumLevel?: PermissionLevel;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredScope,
  minimumLevel,
}) => {
  const location = useLocation();
  const isAuthenticated = hasSessionToken();
  const hasAccess = useHasPermission(requiredScope ?? '', minimumLevel ?? 'ReadOnly');

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredScope && !hasAccess) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
