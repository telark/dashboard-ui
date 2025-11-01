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
} from '../pages';
import AnimatedPageWrapper from '../components/shared/AnimatedPageWrapper';
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
    </Routes>
  );
};

export default AppRoutes;
