import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AnimatedPageWrapper from '../components/animation/AnimatedPageWrapper';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { FancySpinner } from '../components/shared';
import { APP_ROUTES } from '../constants';
import { hasSessionToken } from '../utils/auth/session/token';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('../pages/home/Dashboard'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const GroupersGlobalView = lazy(() => import('../pages/grouper/main/GlobalView'));
const GrouperDetailsView = lazy(() => import('../pages/grouper/details/DetailsView'));
const BridgesGlobalView = lazy(() => import('../pages/bridge/main/GlobalView'));
const BridgeDetailsView = lazy(() => import('../pages/bridge/details/DetailsView'));
const WorkloadsGlobalView = lazy(() => import('../pages/workload/main/GlobalView'));
const AppWorkloadDetailsView = lazy(() => import('../pages/workload/details/apps/DetailsView'));
const RolesCreateView = lazy(() => import('../pages/roles/CreateRole'));
const RolesListView = lazy(() => import('../pages/roles/ListRoles'));
const RoleView = lazy(() => import('../pages/roles/ViewRole'));
const RoleEdit = lazy(() => import('../pages/roles/EditRole'));
const UsersListView = lazy(() => import('../pages/users/ListUsers'));
const UsersCreateView = lazy(() => import('../pages/users/CreateUser'));
const UserView = lazy(() => import('../pages/users/ViewUser'));
const UserEdit = lazy(() => import('../pages/users/EditUser'));
const GroupsListView = lazy(() => import('../pages/groups/ListGroups'));
const GroupsCreateView = lazy(() => import('../pages/groups/CreateGroup'));
const GroupView = lazy(() => import('../pages/groups/ViewGroup'));
const GroupEdit = lazy(() => import('../pages/groups/EditGroup'));
const PasskeysListView = lazy(() => import('../pages/passkeys/ListPasskeys'));
const PasskeyView = lazy(() => import('../pages/passkeys/ViewPasskey'));
const PasskeyEdit = lazy(() => import('../pages/passkeys/EditPasskey'));
const PasskeyCreateView = lazy(() => import('../pages/passkeys/CreatePasskey'));

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
          path={APP_ROUTES.PASSKEY_EDIT}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <PasskeyEdit />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PASSKEY_CREATE}
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <PasskeyCreateView />
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
