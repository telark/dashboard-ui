import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute, AuthLayout } from '../features/auth/components';
import { AnimatedPageWrapper } from '../components/animation';
import { FeatureErrorBoundary } from '../components/error-boundary';
import FullPageLoader from '../components/display/views/FullPageLoader';
import { NoPermissionCard, PageContainer } from '../components/shared';
import { APP_ROUTES, MENU_LABELS } from '../constants';
import { LIST_PAGE } from '../constants/shared/pages';
import type { RequiredPermission } from '../interfaces/shared';
import { hasSessionToken } from '../features/auth/utils';
import { PermissionGate, ACTION_PERMISSIONS } from '../features/auth/hooks';

const { view: viewApplications } = ACTION_PERMISSIONS.applications;
const { view: viewPlans } = ACTION_PERMISSIONS.protectionPlans;
const { view: viewInsights } = ACTION_PERMISSIONS.insights;
const { view: viewRoles } = ACTION_PERMISSIONS.roles;
const { view: viewUsers } = ACTION_PERMISSIONS.users;
const { view: viewGroups } = ACTION_PERMISSIONS.groups;

// Replaces the page: the URL and sidebar entry stay put and the page's requests never fire.
const noAccess = (featureName: string, permission: RequiredPermission) => (
  <PageContainer title={featureName} gap={LIST_PAGE.CONTENT_GAP_PX}>
    <NoPermissionCard featureName={featureName} permission={permission} />
  </PageContainer>
);

// home
const Dashboard = lazy(() => import('../features/home/pages/Dashboard'));

// auth
const Login = lazy(() => import('../features/auth/pages/flow/Login'));
const Register = lazy(() => import('../features/auth/pages/flow/Register'));
const GoogleCallback = lazy(() => import('../features/auth/pages/flow/GoogleCallback'));

// resources
const ApplicationsGlobalView = lazy(
  () => import('../features/applications/pages/main/GlobalView'),
);
const ApplicationDetailsView = lazy(
  () => import('../features/applications/pages/details/DetailsView'),
);
const InsightsPage = lazy(() => import('../features/insights/pages/InsightsPage'));

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

const AppRoutes: React.FC = () => {
  const isAuthenticated = hasSessionToken();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Suspense fallback={<FullPageLoader minHeight="100vh" />}>
      <Routes location={location}>
        {/* One layout instance spans both auth routes, so the brand panel is not
            remounted when navigating between login and register. */}
        <Route
          element={isAuthenticated ? <Navigate to={APP_ROUTES.HOME} replace /> : <AuthLayout />}
        >
          <Route path={APP_ROUTES.LOGIN} element={<Login />} />
          <Route path={APP_ROUTES.REGISTER} element={<Register />} />
        </Route>
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
              <PermissionGate
                requiredScope={viewApplications.scope}
                requiredLevel={viewApplications.level}
                fallback={noAccess(MENU_LABELS.APPLICATIONS, viewApplications)}
              >
                <FeatureErrorBoundary featureName="Applications">
                  <ApplicationsGlobalView />
                </FeatureErrorBoundary>
              </PermissionGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.APPLICATION_DETAILS}
          element={
            <ProtectedRoute>
              <PermissionGate
                requiredScope={viewApplications.scope}
                requiredLevel={viewApplications.level}
                fallback={noAccess(MENU_LABELS.APPLICATIONS, viewApplications)}
              >
                <FeatureErrorBoundary featureName="Application Details">
                  <AnimatedPageWrapper>
                    <ApplicationDetailsView />
                  </AnimatedPageWrapper>
                </FeatureErrorBoundary>
              </PermissionGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.INSIGHTS}
          element={
            <ProtectedRoute>
              <PermissionGate
                requiredScope={viewInsights.scope}
                requiredLevel={viewInsights.level}
                fallback={noAccess(MENU_LABELS.INSIGHTS, viewInsights)}
              >
                <FeatureErrorBoundary featureName="Insights">
                  <InsightsPage />
                </FeatureErrorBoundary>
              </PermissionGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLES}
          element={
            <ProtectedRoute>
              <PermissionGate
                requiredScope={viewRoles.scope}
                requiredLevel={viewRoles.level}
                fallback={noAccess(MENU_LABELS.ROLES, viewRoles)}
              >
                <FeatureErrorBoundary featureName="Roles">
                  <RolesMainPage />
                </FeatureErrorBoundary>
              </PermissionGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USERS}
          element={
            <ProtectedRoute>
              <PermissionGate
                requiredScope={viewUsers.scope}
                requiredLevel={viewUsers.level}
                fallback={noAccess(MENU_LABELS.USERS, viewUsers)}
              >
                <FeatureErrorBoundary key={APP_ROUTES.USERS} featureName="Users">
                  <UsersMainPage />
                </FeatureErrorBoundary>
              </PermissionGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPS}
          element={
            <ProtectedRoute>
              <PermissionGate
                requiredScope={viewGroups.scope}
                requiredLevel={viewGroups.level}
                fallback={noAccess(MENU_LABELS.GROUPS, viewGroups)}
              >
                <FeatureErrorBoundary key={APP_ROUTES.GROUPS} featureName="Groups">
                  <GroupsMainPage />
                </FeatureErrorBoundary>
              </PermissionGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PROTECTION_PLANS}
          element={
            <ProtectedRoute>
              <PermissionGate
                requiredScope={viewPlans.scope}
                requiredLevel={viewPlans.level}
                action={viewPlans.deny}
                fallback={noAccess(MENU_LABELS.PROTECTION_PLANS, viewPlans)}
              >
                <FeatureErrorBoundary featureName="Protection Plans">
                  <ProtectionPlansMainPage />
                </FeatureErrorBoundary>
              </PermissionGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PROTECTION_PLAN_DETAILS}
          element={
            <ProtectedRoute>
              <PermissionGate
                requiredScope={viewPlans.scope}
                requiredLevel={viewPlans.level}
                action={viewPlans.deny}
                fallback={noAccess(MENU_LABELS.PROTECTION_PLANS, viewPlans)}
              >
                <FeatureErrorBoundary featureName="Protection Plan Details">
                  <ProtectionPlanDetailsView />
                </FeatureErrorBoundary>
              </PermissionGate>
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
        <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
