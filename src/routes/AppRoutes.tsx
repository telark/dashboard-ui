import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AnimatedPageWrapper from '../components/animation/AnimatedPageWrapper';
import { ProtectedRoute } from '../features/auth/components';
import { FancySpinner } from '../components/shared';
import { APP_ROUTES } from '../constants';
import { hasSessionToken } from '../features/auth/utils';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('../pages/home/Dashboard'));
const Login = lazy(() => import('../features/auth/pages/flow/Login'));
const Register = lazy(() => import('../features/auth/pages/flow/Register'));
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
const RolesCreateView = lazy(() => import('../pages/roles/CreateRole'));
const RolesListView = lazy(() => import('../pages/roles/ListRoles'));
const RoleView = lazy(() => import('../pages/roles/ViewRole'));
const RoleEdit = lazy(() => import('../pages/roles/EditRole'));
const UsersListView = lazy(
  () => import('../features/access-and-permissions/users/pages/ListUsers'),
);
const UsersCreateView = lazy(
  () => import('../features/access-and-permissions/users/pages/CreateUser'),
);
const UserView = lazy(() => import('../features/access-and-permissions/users/pages/ViewUser'));
const UserEdit = lazy(() => import('../features/access-and-permissions/users/pages/EditUser'));
const GroupsListView = lazy(
  () => import('../features/access-and-permissions/groups/pages/ListGroups'),
);
const GroupsCreateView = lazy(
  () => import('../features/access-and-permissions/groups/pages/CreateGroup'),
);
const GroupView = lazy(() => import('../features/access-and-permissions/groups/pages/ViewGroup'));
const GroupEdit = lazy(() => import('../features/access-and-permissions/groups/pages/EditGroup'));
const PasskeysListView = lazy(() => import('../features/auth/pages/passkeys/ListPasskeys'));
const PasskeyView = lazy(() => import('../features/auth/pages/passkeys/ViewPasskey'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <FancySpinner showLabel={false} />
  </div>
);

const AppRoutes: React.FC = () => {
  const isAuthenticated = hasSessionToken();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path={APP_ROUTES.LOGIN}
          element={
            isAuthenticated ? (
              <Navigate to={APP_ROUTES.HOME} replace />
            ) : (
              <Suspense fallback={<PageLoader />}>
                <Login />
              </Suspense>
            )
          }
        />
        <Route
          path={APP_ROUTES.REGISTER}
          element={
            isAuthenticated ? (
              <Navigate to={APP_ROUTES.HOME} replace />
            ) : (
              <Suspense fallback={<PageLoader />}>
                <Register />
              </Suspense>
            )
          }
        />
        <Route
          path={APP_ROUTES.HOME}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPERS}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <GroupersGlobalView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPER_DETAILS}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <AnimatedPageWrapper>
                  <GrouperDetailsView />
                </AnimatedPageWrapper>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.BRIDGES}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <BridgesGlobalView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.BRIDGE_DETAILS}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <AnimatedPageWrapper>
                  <BridgeDetailsView />
                </AnimatedPageWrapper>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.WORKLOADS}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <WorkloadsGlobalView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.APP_WORKLOAD_DETAILS}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <AnimatedPageWrapper>
                  <AppWorkloadDetailsView />
                </AnimatedPageWrapper>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLES}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <RolesListView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLE_CREATE}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <RolesCreateView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLE_VIEW}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <RoleView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLE_EDIT}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <RoleEdit />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USERS}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <UsersListView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USER_CREATE}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <UsersCreateView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USER_VIEW}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <UserView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USER_EDIT}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <UserEdit />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPS}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <GroupsListView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUP_CREATE}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <GroupsCreateView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUP_VIEW}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <GroupView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUP_EDIT}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <GroupEdit />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PASSKEY_VIEW}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <PasskeyView />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PASSKEYS}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <PasskeysListView />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
