import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Dashboard,
  Login,
  Register,
  Passkeys,
  GroupersGlobalView,
  GrouperDetailsView,
  BridgesGlobalView,
  BridgeDetailsView,
  WorkloadsGlobalView,
  AppWorkloadDetailsView,
  RolesCreateView,
  RolesListView,
  RoleView,
  RoleEdit,
  CategoriesListView,
  CategoryView,
  CategoryEdit,
  UsersListView,
  UsersCreateView,
  UserView,
  UserEdit,
  GroupsListView,
  GroupsCreateView,
  GroupView,
  GroupEdit,
} from '../pages';
import AnimatedPageWrapper from '../components/animation/AnimatedPageWrapper';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { APP_ROUTES } from '../constants';
import { hasSessionToken } from '../utils/auth/session';

const AppRoutes: React.FC = () => {
  const isAuthenticated = hasSessionToken();

  return (
    <Routes>
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
        path={APP_ROUTES.PASSKEYS}
        element={
          <ProtectedRoute>
            <Passkeys />
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
        path={APP_ROUTES.CATEGORIES}
        element={
          <ProtectedRoute>
            <CategoriesListView />
          </ProtectedRoute>
        }
      />
      <Route
        path={APP_ROUTES.CATEGORY_VIEW}
        element={
          <ProtectedRoute>
            <CategoryView />
          </ProtectedRoute>
        }
      />
      <Route
        path={APP_ROUTES.CATEGORY_EDIT}
        element={
          <ProtectedRoute>
            <CategoryEdit />
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
    </Routes>
  );
};

export default AppRoutes;
