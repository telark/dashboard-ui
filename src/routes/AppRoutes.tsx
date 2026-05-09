import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/components';
import { FancySpinner, AnimatedPageWrapper } from '../components/animation';
import { FeatureErrorBoundary } from '../components/error-boundary';
import { APP_ROUTES } from '../constants';
import { hasSessionToken } from '../features/auth/utils';
import store from '../store';
import {
  stopAllSyncRetries,
  syncRetryFromState,
} from '../features/resources/applications/utils/management/syncRetry';

// home
const Dashboard = lazy(() => import('../features/home/pages/Dashboard'));

// auth
const Login = lazy(() => import('../features/auth/pages/flow/Login'));
const Register = lazy(() => import('../features/auth/pages/flow/Register'));
const GoogleCallback = lazy(() => import('../features/auth/pages/flow/GoogleCallback'));

// resources
const ApplicationsGlobalView = lazy(
  () => import('../features/resources/applications/pages/main/GlobalView'),
);
const ApplicationDetailsView = lazy(
  () => import('../features/resources/applications/pages/details/DetailsView'),
);

// access-and-permissions
const RolesMainPage = lazy(() => import('../features/access-and-permissions/roles/pages/MainPage'));
const UsersMainPage = lazy(() => import('../features/access-and-permissions/users/pages/MainPage'));
const GroupsMainPage = lazy(
  () => import('../features/access-and-permissions/groups/pages/MainPage'),
);
const PasskeysMainPage = lazy(() => import('../features/auth/pages/passkeys/MainPage'));
const SettingsPage = lazy(() =>
  import('../features/settings').then((m) => ({ default: m.SettingsPage })),
);
const ProtectionPlansMainPage = lazy(() => import('../features/plans/protection/pages/MainPage'));
const ProtectionPlanDetailsView = lazy(
  () => import('../features/plans/protection/pages/details/DetailsView'),
);

const PageLoader: React.FC = () => (
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

const AppRoutes: React.FC = () => {
  const isAuthenticated = hasSessionToken();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    if (!isApplicationsRoute(location.pathname)) {
      stopAllSyncRetries();
      return;
    }
    syncRetryFromState();
    const unsubscribe = store.subscribe(syncRetryFromState);
    return () => {
      unsubscribe();
      stopAllSyncRetries();
    };
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={location}>
        <Route
          path={APP_ROUTES.LOGIN}
          element={isAuthenticated ? <Navigate to={APP_ROUTES.HOME} replace /> : <Login />}
        />
        <Route
          path={APP_ROUTES.REGISTER}
          element={isAuthenticated ? <Navigate to={APP_ROUTES.HOME} replace /> : <Register />}
        />
        <Route path={APP_ROUTES.GOOGLE_CALLBACK} element={<GoogleCallback />} />
        <Route
          path={APP_ROUTES.HOME}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.APPLICATIONS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Applications">
                <ApplicationsGlobalView />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.APPLICATION_DETAILS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Application Details">
                <AnimatedPageWrapper>
                  <ApplicationDetailsView />
                </AnimatedPageWrapper>
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLES}
          element={
            <ProtectedRoute requiredScope="roles" minimumLevel="ReadOnly">
              <FeatureErrorBoundary featureName="Roles">
                <RolesMainPage />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USERS}
          element={
            <ProtectedRoute requiredScope="users" minimumLevel="ReadOnly">
              <FeatureErrorBoundary key={APP_ROUTES.USERS} featureName="Users">
                <UsersMainPage />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPS}
          element={
            <ProtectedRoute requiredScope="groups" minimumLevel="ReadOnly">
              <FeatureErrorBoundary key={APP_ROUTES.GROUPS} featureName="Groups">
                <GroupsMainPage />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PROTECTION_PLANS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Protection Plans">
                <ProtectionPlansMainPage />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PROTECTION_PLAN_DETAILS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Protection Plan Details">
                <ProtectionPlanDetailsView />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PASSKEYS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Passkeys">
                <PasskeysMainPage />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={`${APP_ROUTES.SETTINGS}/*`}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Settings">
                <SettingsPage />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

function isApplicationsRoute(pathname: string): boolean {
  return pathname === APP_ROUTES.APPLICATIONS || pathname.startsWith(`${APP_ROUTES.APPLICATIONS}/`);
}
