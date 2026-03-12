import React, { lazy, Suspense, useTransition, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/components';
import { FancySpinner, AnimatedPageWrapper } from '../components/animation';
import { FeatureErrorBoundary } from '../components/error-boundary';
import { APP_ROUTES } from '../constants';
import { hasSessionToken } from '../features/auth/utils';

// home
const Dashboard = lazy(() => import('../features/home/pages/Dashboard'));

// auth
const Login = lazy(() => import('../features/auth/pages/flow/Login'));
const Register = lazy(() => import('../features/auth/pages/flow/Register'));

// resources
const GroupersGlobalView = lazy(
  () => import('../features/resources/groupers/pages/main/GlobalView'),
);
const GrouperDetailsView = lazy(
  () => import('../features/resources/groupers/pages/details/DetailsView'),
);
const BridgesGlobalView = lazy(() => import('../features/resources/bridges/pages/main/GlobalView'));
const BridgeDetailsView = lazy(
  () => import('../features/resources/bridges/pages/details/DetailsView'),
);
const WorkloadsGlobalView = lazy(
  () => import('../features/resources/workloads/pages/main/GlobalView'),
);
const AppWorkloadDetailsView = lazy(
  () => import('../features/resources/workloads/pages/details/apps/DetailsView'),
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
const ProtectionPlansMainPage = lazy(() => import('../features/protection-plans/pages/MainPage'));

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
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
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
        <Route
          path={APP_ROUTES.HOME}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPERS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Groupers">
                <GroupersGlobalView />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPER_DETAILS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Grouper Details">
                <AnimatedPageWrapper>
                  <GrouperDetailsView />
                </AnimatedPageWrapper>
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.BRIDGES}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Bridges">
                <BridgesGlobalView />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.BRIDGE_DETAILS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Bridge Details">
                <AnimatedPageWrapper>
                  <BridgeDetailsView />
                </AnimatedPageWrapper>
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.WORKLOADS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Workloads">
                <WorkloadsGlobalView />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.APP_WORKLOAD_DETAILS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Workload Details">
                <AnimatedPageWrapper>
                  <AppWorkloadDetailsView />
                </AnimatedPageWrapper>
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLES}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Roles">
                <RolesMainPage />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USERS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary key={APP_ROUTES.USERS} featureName="Users">
                <UsersMainPage />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPS}
          element={
            <ProtectedRoute>
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
          path={APP_ROUTES.SETTINGS}
          element={
            <ProtectedRoute>
              <FeatureErrorBoundary featureName="Settings">
                <SettingsPage />
              </FeatureErrorBoundary>
            </ProtectedRoute>
          }
        />
      </Routes>
      {isPending && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #20c997, #10b981)',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out',
          }}
        />
      )}
    </Suspense>
  );
};

export default AppRoutes;
