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
  UsersCreateView,
  UserView,
  UserEdit,
  GroupsListView,
  GroupsCreateView,
  GroupView,
  GroupEdit,
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
      <Route path={APP_ROUTES.USER_CREATE} element={<UsersCreateView />} />
      <Route path={APP_ROUTES.USER_VIEW} element={<UserView />} />
      <Route path={APP_ROUTES.USER_EDIT} element={<UserEdit />} />
      <Route path={APP_ROUTES.GROUPS} element={<GroupsListView />} />
      <Route path={APP_ROUTES.GROUP_CREATE} element={<GroupsCreateView />} />
      <Route path={APP_ROUTES.GROUP_VIEW} element={<GroupView />} />
      <Route path={APP_ROUTES.GROUP_EDIT} element={<GroupEdit />} />
    </Routes>
  );
};

export default AppRoutes;
