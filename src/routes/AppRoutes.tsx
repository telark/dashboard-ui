import React, { lazy, Suspense, useTransition, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/components';
import { FancySpinner, AnimatedPageWrapper } from '../components/animation';
import { APP_ROUTES } from '../constants';
import { hasSessionToken } from '../features/auth/utils';

const Dashboard = lazy(() => import('../features/home/pages/Dashboard'));
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
const RolesCreateView = lazy(
  () => import('../features/access-and-permissions/roles/pages/CreateRole'),
);
const RolesListView = lazy(
  () => import('../features/access-and-permissions/roles/pages/ListRoles'),
);
const RoleView = lazy(() => import('../features/access-and-permissions/roles/pages/ViewRole'));
const RoleEdit = lazy(() => import('../features/access-and-permissions/roles/pages/EditRole'));
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
              <GroupersGlobalView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPER_DETAILS}
          element={
            <ProtectedRoute>
              <AnimatedPageWrapper>
                <GrouperDetailsView />
              </AnimatedPageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.BRIDGES}
          element={
            <ProtectedRoute>
              <BridgesGlobalView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.BRIDGE_DETAILS}
          element={
            <ProtectedRoute>
              <AnimatedPageWrapper>
                <BridgeDetailsView />
              </AnimatedPageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.WORKLOADS}
          element={
            <ProtectedRoute>
              <WorkloadsGlobalView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.APP_WORKLOAD_DETAILS}
          element={
            <ProtectedRoute>
              <AnimatedPageWrapper>
                <AppWorkloadDetailsView />
              </AnimatedPageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLES}
          element={
            <ProtectedRoute>
              <RolesListView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLE_CREATE}
          element={
            <ProtectedRoute>
              <RolesCreateView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLE_VIEW}
          element={
            <ProtectedRoute>
              <RoleView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.ROLE_EDIT}
          element={
            <ProtectedRoute>
              <RoleEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USERS}
          element={
            <ProtectedRoute>
              <UsersListView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USER_CREATE}
          element={
            <ProtectedRoute>
              <UsersCreateView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USER_VIEW}
          element={
            <ProtectedRoute>
              <UserView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.USER_EDIT}
          element={
            <ProtectedRoute>
              <UserEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUPS}
          element={
            <ProtectedRoute>
              <GroupsListView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUP_CREATE}
          element={
            <ProtectedRoute>
              <GroupsCreateView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUP_VIEW}
          element={
            <ProtectedRoute>
              <GroupView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.GROUP_EDIT}
          element={
            <ProtectedRoute>
              <GroupEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PASSKEY_VIEW}
          element={
            <ProtectedRoute>
              <PasskeyView />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.PASSKEYS}
          element={
            <ProtectedRoute>
              <PasskeysListView />
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
