import React, { useState } from 'react';
import { Layout, message, App as AntdApp } from 'antd';
import { BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import ErrorBoundary from './ErrorBoundary';
import { SessionExpiredModal } from './features/auth/components';
import 'antd/dist/reset.css';
import { DEFAULT_COLORS, APP_CONFIGS, APP_ROUTES } from './constants';
import AppRoutes from './routes/AppRoutes';
import { hasSessionToken, useSessionExpirationCheck } from './features/auth/utils';
import { useInitializePermissions } from './features/auth/hooks';
import { useInitializeCategories } from './features/access-and-permissions/categories/hooks';
import { useInitializeRoles } from './features/access-and-permissions/roles/hooks';

message.config({ top: APP_CONFIGS.MESSAGE.TOP, maxCount: APP_CONFIGS.MESSAGE.MAX_COUNT });

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === APP_ROUTES.LOGIN ||
    location.pathname === APP_ROUTES.REGISTER ||
    location.pathname === APP_ROUTES.GOOGLE_CALLBACK;
  const isAuthenticated = hasSessionToken();
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  // Check session expiration as background task when authenticated
  useSessionExpirationCheck({
    isAuthenticated,
    isAuthRoute,
    onSessionExpired: () => setShowSessionExpiredModal(true),
  });

  // Initialize built-in categories, roles, and user permissions when authenticated
  useInitializeCategories(isAuthenticated);
  useInitializeRoles(isAuthenticated);
  useInitializePermissions(isAuthenticated);

  const renderMainContent = () => {
    if (isAuthRoute) {
      return <AppRoutes />;
    }

    if (isAuthenticated) {
      return (
        <Layout style={{ minHeight: APP_CONFIGS.LAYOUT.MIN_HEIGHT }}>
          <Sidebar />
          <Layout
            style={{
              marginLeft: APP_CONFIGS.LAYOUT.MARGIN_LEFT,
              height: APP_CONFIGS.LAYOUT.HEIGHT,
              transition: APP_CONFIGS.LAYOUT.TRANSITION,
              background: DEFAULT_COLORS.PAGE_BG,
            }}
          >
            <Header />
            <AppRoutes />
          </Layout>
        </Layout>
      );
    }
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  };

  return (
    <AntdApp>
      {renderMainContent()}
      <SessionExpiredModal
        open={showSessionExpiredModal}
        onClose={() => setShowSessionExpiredModal(false)}
      />
    </AntdApp>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
