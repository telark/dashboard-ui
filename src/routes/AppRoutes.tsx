import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Dashboard,
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
  GroupsListView,
} from '../pages';
import AnimatedPageWrapper from '../components/animation/AnimatedPageWrapper';
import { APP_ROUTES } from '../constants';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.HOME} element={<Dashboard />} />
      <Route path={APP_ROUTES.GROUPERS} element={<GroupersGlobalView />} />
      <Route
        path={APP_ROUTES.GROUPER_DETAILS}
        element={
          <AnimatedPageWrapper>
            <GrouperDetailsView />
          </AnimatedPageWrapper>
        }
      />
      <Route path={APP_ROUTES.BRIDGES} element={<BridgesGlobalView />} />
      <Route
        path={APP_ROUTES.BRIDGE_DETAILS}
        element={
          <AnimatedPageWrapper>
            <BridgeDetailsView />
          </AnimatedPageWrapper>
        }
      />
      <Route path={APP_ROUTES.WORKLOADS} element={<WorkloadsGlobalView />} />
      <Route
        path={APP_ROUTES.APP_WORKLOAD_DETAILS}
        element={
          <AnimatedPageWrapper>
            <AppWorkloadDetailsView />
          </AnimatedPageWrapper>
        }
      />
      <Route path={APP_ROUTES.ROLES} element={<RolesListView />} />
      <Route path={APP_ROUTES.ROLE_CREATE} element={<RolesCreateView />} />
      <Route path={APP_ROUTES.ROLE_VIEW} element={<RoleView />} />
      <Route path={APP_ROUTES.ROLE_EDIT} element={<RoleEdit />} />
      <Route path={APP_ROUTES.CATEGORIES} element={<CategoriesListView />} />
      <Route path={APP_ROUTES.CATEGORY_VIEW} element={<CategoryView />} />
      <Route path={APP_ROUTES.CATEGORY_EDIT} element={<CategoryEdit />} />
      <Route path={APP_ROUTES.USERS} element={<UsersListView />} />
      <Route path={APP_ROUTES.GROUPS} element={<GroupsListView />} />
    </Routes>
  );
};

export default AppRoutes;
